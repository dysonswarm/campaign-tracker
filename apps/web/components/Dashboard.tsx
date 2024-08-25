"use client";
import { Button } from "@campaign-tracker/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@campaign-tracker/ui/components/card";
import { Textarea } from "@campaign-tracker/ui/components/textarea";
import React, { useState } from "react";

interface Widget {
  id: string;
  type: string;
  // Add more properties as needed
}

export function Dashboard() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [chatInput, setChatInput] = useState("");

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with your NLP service to process the chatInput
    // and determine which widget to add. For now, we'll just add a dummy widget.
    const newWidget: Widget = {
      id: Date.now().toString(),
      type: "dummy",
    };
    setWidgets([...widgets, newWidget]);
    setChatInput("");
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 md:top-6 md:self-start">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <Card>
            <CardHeader>
              <CardTitle>Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleChatSubmit}
                className="flex flex-col space-y-2"
              >
                <Textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Describe the widget you want to add..."
                  className="resize-none border rounded-md p-2"
                  rows={3}
                />
                <Button type="submit">Add Widget</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-3/4 overflow-auto max-h-[calc(100vh-100px)] m-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {widgets.map((widget) => (
              <Card key={widget.id} className="min-h-[250px]">
                <CardHeader>
                  <CardTitle>Widget {widget.id}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Widget of type: {widget.type}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
