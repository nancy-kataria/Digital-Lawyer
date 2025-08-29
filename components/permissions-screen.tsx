"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Mic, Shield, AlertCircle } from "lucide-react"

interface PermissionsScreenProps {
  onPermissionsGranted: () => void
}

export function PermissionsScreen({ onPermissionsGranted }: PermissionsScreenProps) {
  const [isRequesting, setIsRequesting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestPermissions = async () => {
    setIsRequesting(true)
    setError(null)

    try {
      // Request camera and microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      // Stop the stream immediately as we just needed permissions
      stream.getTracks().forEach((track) => track.stop())

      onPermissionsGranted()
    } catch (err) {
      console.error("Permission denied:", err)
      setError(
        "Camera and microphone access are required for incident capture functionality. Please allow access and try again.",
      )
    } finally {
      setIsRequesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
            <Shield className="h-8 w-8 text-accent" />
          </div>
          <CardTitle className="text-2xl font-bold text-balance">Digital Lawyer Permissions</CardTitle>
          <CardDescription className="text-pretty">
            We need access to your camera and microphone to provide incident capture and AI assistance features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <Camera className="h-5 w-5 text-accent" />
              <div>
                <p className="font-medium">Camera Access</p>
                <p className="text-sm text-muted-foreground">Record incidents and capture evidence</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <Mic className="h-5 w-5 text-accent" />
              <div>
                <p className="font-medium">Microphone Access</p>
                <p className="text-sm text-muted-foreground">Voice commands and audio recording</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button onClick={requestPermissions} disabled={isRequesting} className="w-full" size="lg">
            {isRequesting ? "Requesting Permissions..." : "Grant Permissions"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
