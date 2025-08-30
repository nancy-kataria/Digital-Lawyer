"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Camera, Mic, Square, AlertTriangle, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface IncidentCaptureProps {
  onBack: () => void
}

interface TranscriptEntry {
  id: string
  text: string
  speaker: "user" | "ai"
  timestamp: Date
}

interface EmergencyContact {
  id: string
  name: string
  phone: string
  email: string
  relationship: string
}

export function IncidentCapture({ onBack }: IncidentCaptureProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([])
  const [currentSubtitle, setCurrentSubtitle] = useState("")
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([])

  const videoRef = useRef<HTMLVideoElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const { toast } = useToast()

  // Load emergency contacts
  useEffect(() => {
    const savedContacts = localStorage.getItem("digital-lawyer-emergency-contacts")
    if (savedContacts) {
      setEmergencyContacts(JSON.parse(savedContacts))
    }
  }, [])

  // Initialize camera and microphone
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // Use back camera for incidents
          audio: true,
        })

        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (error) {
        console.error("Error accessing media devices:", error)
        toast({
          title: "Camera Access Error",
          description: "Unable to access camera and microphone. Please check permissions.",
          variant: "destructive",
        })
      }
    }

    initializeMedia()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Initialize speech recognition
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()

      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US"

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        if (finalTranscript) {
          handleUserSpeech(finalTranscript)
        }
        setCurrentSubtitle(interimTranscript)
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error)
        toast({
          title: "Speech Recognition Error",
          description: "Unable to process speech. Please try again.",
          variant: "destructive",
        })
      }

      recognitionRef.current = recognition
    } else {
      toast({
        title: "Speech Recognition Unavailable",
        description: "Your browser doesn't support speech recognition. You can still record video.",
        variant: "destructive",
      })
    }
  }, [])

  const startRecording = async () => {
    if (!stream) return

    try {
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      recorder.onstop = () => {
        setRecordedChunks(chunks)
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start()
        setIsListening(true)
      }

      // Add initial AI greeting
      const greeting = "I'm here to help you with this incident. Please describe what's happening."
      addToTranscript(greeting, "ai")
      speakText(greeting)
    } catch (error) {
      console.error("Error starting recording:", error)
      toast({
        title: "Recording Error",
        description: "Unable to start recording. Please try again.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop()
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }

    setIsRecording(false)
    setCurrentSubtitle("")
  }

  const handleUserSpeech = async (speechText: string) => {
    addToTranscript(speechText, "user")
    setIsProcessing(true)

    try {
      const aiResponse = await processIncidentSpeech(speechText)
      addToTranscript(aiResponse, "ai")
      speakText(aiResponse)

      // Check if emergency response is needed
      if (
        speechText.toLowerCase().includes("accident") ||
        speechText.toLowerCase().includes("emergency") ||
        speechText.toLowerCase().includes("help") ||
        speechText.toLowerCase().includes("injured")
      ) {
        notifyEmergencyContacts()
      }
    } catch (error) {
      console.error("Error processing speech:", error)
      const errorResponse =
        "I'm having trouble processing that. Please repeat or call emergency services if this is urgent."
      addToTranscript(errorResponse, "ai")
      speakText(errorResponse)
    } finally {
      setIsProcessing(false)
    }
  }

  const processIncidentSpeech = async (input: string): Promise<string> => {
    // Simulate AI processing - in production, this would call HuggingFace API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("accident") || lowerInput.includes("crash")) {
      return "I understand there's been an accident. First, are you or anyone else injured? If so, call 911 immediately. If everyone is safe, document the scene, exchange information with other parties, and contact your insurance company."
    }

    if (lowerInput.includes("injured") || lowerInput.includes("hurt")) {
      return "If someone is injured, call 911 right away. Do not move injured persons unless they're in immediate danger. I'm notifying your emergency contacts now."
    }

    if (lowerInput.includes("fire") || lowerInput.includes("smoke")) {
      return "If there's a fire, evacuate immediately and call 911. Get to a safe distance and wait for emergency services. Do not re-enter the area."
    }

    if (lowerInput.includes("theft") || lowerInput.includes("stolen")) {
      return "For theft incidents, ensure your safety first. If the perpetrator is gone, document what was stolen and call the police to file a report. Take photos of the scene if safe to do so."
    }

    return "I'm documenting this incident. Please continue describing what happened. If this is an emergency requiring immediate assistance, call 911 now."
  }

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const addToTranscript = (text: string, speaker: "user" | "ai") => {
    const entry: TranscriptEntry = {
      id: Date.now().toString(),
      text,
      speaker,
      timestamp: new Date(),
    }
    setTranscript((prev) => [...prev, entry])
  }

  const notifyEmergencyContacts = () => {
    if (emergencyContacts.length > 0) {
      const contactNames = emergencyContacts.map((c) => c.name).join(", ")
      toast({
        title: "Emergency Contacts Notified",
        description: `${contactNames} ${emergencyContacts.length === 1 ? "has" : "have"} been automatically notified of this incident.`,
        duration: 5000,
      })

      // In a real app, this would send actual notifications
      emergencyContacts.forEach((contact) => {
        console.log(`Notifying ${contact.name} at ${contact.phone}`)
        // Simulate SMS/call notification
      })
    } else {
      toast({
        title: "No Emergency Contacts",
        description: "Add emergency contacts in settings to enable automatic notifications.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const callEmergency = () => {
    // In a real app, this would initiate a call
    window.location.href = "tel:911"
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive">
                <Camera className="h-6 w-6 text-destructive-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Incident Capture</h1>
                <p className="text-sm text-muted-foreground">Real-time Documentation</p>
              </div>
            </div>

            <Button
              onClick={callEmergency}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              size="sm"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call 911
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Video Feed */}
          <Card>
            <CardContent className="p-0">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />

                {/* Recording Indicator */}
                {isRecording && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-destructive text-destructive-foreground px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-destructive-foreground rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">RECORDING</span>
                  </div>
                )}

                {/* Listening Indicator */}
                {isListening && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-accent text-accent-foreground px-3 py-1 rounded-full">
                    <Mic className="w-4 h-4" />
                    <span className="text-sm font-medium">LISTENING</span>
                  </div>
                )}

                {/* Current Subtitle */}
                {currentSubtitle && (
                  <div className="absolute bottom-4 left-4 right-4 bg-black/80 text-white p-3 rounded-lg">
                    <p className="text-sm">{currentSubtitle}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            {!isRecording ? (
              <Button onClick={startRecording} size="lg" className="bg-destructive hover:bg-destructive/90">
                <Camera className="h-5 w-5 mr-2" />
                Start Recording
              </Button>
            ) : (
              <Button onClick={stopRecording} size="lg" variant="outline">
                <Square className="h-5 w-5 mr-2" />
                Stop Recording
              </Button>
            )}
          </div>

          {/* Transcript */}
          {transcript.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-accent" />
                  Incident Transcript
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {transcript.map((entry) => (
                    <div
                      key={entry.id}
                      className={cn("flex gap-3", entry.speaker === "user" ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-4 py-2",
                          entry.speaker === "user" ? "bg-accent text-accent-foreground" : "bg-muted",
                        )}
                      >
                        <p className="text-sm">{entry.text}</p>
                        <div className="text-xs opacity-50 mt-1">{entry.timestamp.toLocaleTimeString()}</div>
                      </div>
                    </div>
                  ))}

                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-4 py-2">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-accent rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-accent rounded-full animate-bounce delay-200"></div>
                          </div>
                          <span className="text-sm text-muted-foreground">Processing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="font-semibold">How to use Incident Capture:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Start recording to document the incident with video and audio</li>
                    <li>• Speak clearly to describe what&apos;s happening</li>
                    <li>• The AI will provide real-time guidance and suggestions</li>
                    <li>• Emergency contacts will be notified automatically for serious incidents</li>
                    <li>• Call 911 immediately for any life-threatening emergencies</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <div className="text-center p-4 rounded-lg bg-muted/50 border border-accent/20">
            <p className="text-sm text-muted-foreground">
              Digital lawyer can make mistakes, please double check responses. For immediate emergencies, always call
              911 first.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
