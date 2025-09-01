"use client"

import { useState, useEffect } from "react"
import { PermissionsScreen } from "./permissions-screen"
import { DisclaimerScreen } from "./disclaimer-screen"
import { HomeScreen } from "./home-screen"

type AppState = "permissions" | "disclaimer" | "home"

export function AppWrapper() {
  const [appState, setAppState] = useState<AppState>("permissions")

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const permissionStatus = await navigator.permissions.query({ name: "camera" as PermissionName })
        const micPermissionStatus = await navigator.permissions.query({ name: "microphone" as PermissionName })

        if (permissionStatus.state === "granted" && micPermissionStatus.state === "granted") {
          const disclaimerAccepted = localStorage.getItem("digital-lawyer-disclaimer-accepted")
          if (disclaimerAccepted) {
            setAppState("home")
          } else {
            setAppState("disclaimer")
          }
        }
      } catch (error) {
        console.log("Permissions API not supported", error)
      }
    }

    checkPermissions()
  }, [])

  const handlePermissionsGranted = () => {
    setAppState("disclaimer")
  }

  const handleDisclaimerAccepted = () => {
    localStorage.setItem("digital-lawyer-disclaimer-accepted", "true")
    setAppState("home")
  }

  switch (appState) {
    case "permissions":
      return <PermissionsScreen onPermissionsGranted={handlePermissionsGranted} />
    case "disclaimer":
      return <DisclaimerScreen onAccept={handleDisclaimerAccepted} />
    case "home":
      return <HomeScreen />
    default:
      return <PermissionsScreen onPermissionsGranted={handlePermissionsGranted} />
  }
}
