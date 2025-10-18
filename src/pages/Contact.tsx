import { TacticalSidebar } from "@/components/TacticalSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AdminToolbar } from "@/components/AdminToolbar";
import { Mail, Github, Linkedin, Globe, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { EditableContactInfo, ContactInfoItem } from "@/components/EditableContactInfo";
import { EditableText } from "@/components/EditableText";

export default function Contact() {
  const { isOwner } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message transmitted successfully");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo: ContactInfoItem[] = [
    { id: "contact_1", icon: "Mail", label: "Email", value: "agent@tactical-ops.com", link: "mailto:agent@tactical-ops.com" },
    { id: "contact_2", icon: "Phone", label: "Phone", value: "+1 (555) 123-4567", link: "tel:+15551234567" },
    { id: "contact_3", icon: "MapPin", label: "Location", value: "San Francisco, CA", link: null },
    { id: "contact_4", icon: "Github", label: "GitHub", value: "@yourusername", link: "https://github.com/yourusername" },
    { id: "contact_5", icon: "Linkedin", label: "LinkedIn", value: "Your Name", link: "https://linkedin.com/in/yourprofile" },
    { id: "contact_6", icon: "Globe", label: "Website", value: "tactical-ops.com", link: "https://tactical-ops.com" },
  ];

  const iconMap = { Mail, Phone, MapPin, Github, Linkedin, Globe };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AdminToolbar />
      <TacticalSidebar />
      <div className={`flex-1 ${isOwner ? 'pt-[60px]' : ''}`}>
        <DashboardHeader title="SYSTEMS" classification="COMMUNICATION CHANNEL" />
        <main className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Form */}
            <div className="tactical-border rounded bg-card p-6">
              <h2 className="text-xl font-bold text-foreground mb-1">SECURE TRANSMISSION</h2>
              <p className="text-xs text-primary mb-6">Send encrypted message</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">AGENT NAME</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="bg-background border-primary/30 text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">EMAIL ADDRESS</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className="bg-background border-primary/30 text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">SUBJECT</label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Message subject"
                    className="bg-background border-primary/30 text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">MESSAGE</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Enter your message..."
                    className="bg-background border-primary/30 text-foreground min-h-32"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  TRANSMIT MESSAGE
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="tactical-border rounded bg-card p-6">
                <EditableText
                  id="contact_protocols_title"
                  initialValue="CONTACT PROTOCOLS"
                  className="text-xl font-bold text-foreground mb-1"
                  as="h2"
                />
                <EditableText
                  id="contact_protocols_subtitle"
                  initialValue="Available communication channels"
                  className="text-xs text-primary mb-6"
                  as="p"
                />
                
                <EditableContactInfo
                  storageKey="contact_info_items"
                  initialItems={contactInfo}
                  icons={iconMap}
                />
              </div>

              <div className="tactical-border rounded bg-card p-6">
                <EditableText
                  id="response_time_title"
                  initialValue="RESPONSE TIME"
                  className="text-sm font-bold text-foreground mb-4"
                  as="h3"
                />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-glow" />
                    <EditableText
                      id="response_time_1"
                      initialValue="Email: Within 24 hours"
                      className="text-xs text-muted-foreground"
                      as="span"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
                    <EditableText
                      id="response_time_2"
                      initialValue="LinkedIn: 1-2 business days"
                      className="text-xs text-muted-foreground"
                      as="span"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
                    <EditableText
                      id="response_time_3"
                      initialValue="Phone: By appointment"
                      className="text-xs text-muted-foreground"
                      as="span"
                    />
                  </div>
                </div>
              </div>

              <div className="tactical-border rounded bg-card p-6">
                <EditableText
                  id="availability_title"
                  initialValue="AVAILABILITY"
                  className="text-sm font-bold text-foreground mb-4"
                  as="h3"
                />
                <EditableText
                  id="availability_subtitle"
                  initialValue="Current Status"
                  className="text-xs text-muted-foreground mb-3"
                  as="p"
                />
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-glow" />
                  <EditableText
                    id="availability_status"
                    initialValue="AVAILABLE FOR PROJECTS"
                    className="text-sm text-foreground"
                    as="span"
                  />
                </div>
                <EditableText
                  id="availability_description"
                  initialValue="Open to new opportunities and collaborations. Feel free to reach out for freelance projects, full-time positions, or technical consultations."
                  className="text-xs text-muted-foreground leading-relaxed"
                  as="p"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
