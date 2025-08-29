"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Scale } from "lucide-react"

interface DisclaimerScreenProps {
  onAccept: () => void
}

export function DisclaimerScreen({ onAccept }: DisclaimerScreenProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
            <Scale className="h-8 w-8 text-accent" />
          </div>
          <CardTitle className="text-2xl font-bold text-balance">Legal Disclaimer</CardTitle>
          <CardDescription className="text-pretty">
            Please read and acknowledge the following important information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 rounded-lg bg-muted border-l-4 border-accent">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Important Notice</h3>
                <p className="text-pretty leading-relaxed">
                  <strong>Digital Lawyer</strong> offers simplified legal information, but it&apos;s always advisable to
                  consult a professional lawyer for confirmation. It is an informational tool and not a substitute for
                  legal advice from a qualified attorney.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• This app provides general legal information only</p>
                  <p>• AI responses may contain errors or inaccuracies</p>
                  <p>• Always verify information with qualified legal professionals</p>
                  <p>• Emergency situations require immediate professional assistance</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
            <p className="text-sm text-center text-muted-foreground">
              By continuing, you acknowledge that you understand this disclaimer and agree to use this app as an
              informational tool only.
            </p>
          </div>

          <Button onClick={onAccept} className="w-full" size="lg">
            I Understand and Accept
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
