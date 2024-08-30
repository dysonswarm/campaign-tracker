"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@campaign-tracker/ui/components/card";
import { useState } from "react";
import { ChatForm, Widget } from "./ChatForm";

export function Dashboard() {
  const [widgets, setWidgets] = useState<Widget[]>([]);

  const handleChatSubmit = async (form: Widget) => {
    debugger;
    // Here you would integrate with your NLP service to process the chatInput
    // and determine which widget to add. For now, we'll just add a dummy widget.

    setWidgets([...widgets, form]);
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
              <ChatForm onSubmit={handleChatSubmit} />
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
