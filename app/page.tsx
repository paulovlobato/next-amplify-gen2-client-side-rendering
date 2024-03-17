"use client";

import { Button, withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import TodoList from "@/components/TodoList";
import { signOut } from "aws-amplify/auth";

function App() {
  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      console.log('Error signing out: ', error)
    }
  }
  return (
    <>
      <h1>Hello, Amplify!</h1>
      <TodoList />
      <Button
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </>
  )
}

export default withAuthenticator(App);