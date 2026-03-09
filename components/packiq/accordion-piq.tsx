import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { PackiqRecentUpload } from "../PackIQ-Recent-Uploads"
import { Card } from "../ui/card"

const items = [
  {
    value: "notifications",
    trigger: "Notification Settings",
    content:
      "Manage how you receive notifications. You can enable email alerts for updates or push notifications for mobile devices.",
  },
  {
    value: "privacy",
    trigger: "Privacy & Security",
    content:
      "Control your privacy settings and security preferences. Enable two-factor authentication, manage connected devices, review active sessions, and configure data sharing preferences. You can also download your data or delete your account.",
  },
  {
    value: "billing",
    trigger: "Billing & Subscription",
    content:
      "View your current plan, payment history, and upcoming invoices. Update your payment method, change your subscription tier, or cancel your subscription.",
  },
]

export function AccordionPIQ() {
  return (
    <>
    <Card>
    <Accordion
      type="multiple"
      className=""
      defaultValue={["notifications"]}
    >
      {items.map((item) => (
        <div className="mx-10">
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>
            <div className="flex flex-col">
            <div>AccordionTrigger</div>
            <div>Description</div>
            </div>
            </AccordionTrigger>
          <AccordionContent>
            

            <PackiqRecentUpload/>
          </AccordionContent>
        </AccordionItem>
        </div>
      ))}
    </Accordion>
    </Card>
    </>
  )
}
