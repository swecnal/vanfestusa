import SectionHeading from "@/components/SectionHeading";

export const metadata = {
  title: "FAQ | VanFest",
  description: "Frequently asked questions about VanFest events",
};

const faqs = [
  {
    q: "Do I need a van to attend VanFest?",
    a: "Nope! You can purchase a general attendee ticket. GA ticket holders must exit the venue by a certain time, generally 5pm but the specific time may vary per event. See each event page for specifics.",
  },
  {
    q: "Tell me all about camping at VanFest!",
    a: "When you arrive you'll need to show the entrance tent your ticket (digital or printed), which will get you into the event grounds. You'll also be issued wristbands (which must be worn at all times), an exhibiting pass, raffle tickets, and a site map. Each VanFest event location is different, but generally they'll all be large, open areas with minimal shade. Hookups are generally not available, so you must be self-contained.",
  },
  {
    q: "What camping spot am I assigned?",
    a: "You will not be assigned specific spots. If you would like to park near/next to friends, we recommend that you meet up outside of the event and enter together so that you end up being parked next to each other. Rigs are generally arranged into rows with the passenger/slider door facing outwards, with about 20' in between for your outside setups.",
  },
  {
    q: "Do I have to exhibit my van?",
    a: "Nope! Exhibiting your rig is completely optional, but please consider it! Exhibitors get first-come first-placed parking closest to the action, social media shoutouts, free raffle tickets, option to enter Best in Show, professional photos, and early bird registration for future events. Non-exhibitors will be parked farther from the main event area.",
  },
  {
    q: "What should I bring to VanFest?",
    a: "Along with your normal camping gear: camping chairs and/or blankets, insect repellant, flashlights, food and beverages for the event length (food trucks will also be available), your own plates/silverware/cups to reduce waste, sunblock, hats, sunglasses, and hiking gear or a bike if you want to explore.",
  },
  {
    q: "Will there be bathrooms/showers?",
    a: "Bathrooms – yes. Usually there are flush toilets available, but this varies per event. Porta-potties will be available either way. Showers – no, but we may look into a portable shower truck for future events!",
  },
  {
    q: "Who needs to have tickets?",
    a: "A camping ticket admits you and whoever is traveling with you! For general admission, anyone 13 or over must have a ticket. Children under 13 are free. Campers, vendors, and sponsors all come with various levels of GA access. Wristbands will be given upon check-in and must be worn at all times.",
  },
  {
    q: "How long is the event?",
    a: "Generally, a VanFest event is a three-day weekend affair. Fridays are arrival and a \"vanlife only\" day/evening. Saturday and Sunday are open to the public for tours, vendors/sponsors, music, and food. Each night will have live music and amazing community-building activities!",
  },
  {
    q: "Are pets allowed at the event?",
    a: "Yes! Bring your furry friends – but they must be on a leash. Please clean up after your pets. All pets must be well behaved; if an animal displays aggressive behavior they'll need to remain inside a locked vehicle. If a pet is a disturbance you may be asked to leave the event.",
  },
  {
    q: "Can I leave the venue and come back?",
    a: "Anyone camping is free to come and go on foot/bike/etc, but your camping rig must stay in your spot unless it's an emergency. If you need to leave before the event ends, let us know at hello@vanfestusa.com and we'll accommodate you. For short trips, plan on walking, cycling, or using a rideshare service.",
  },
  {
    q: "Will there be RV hookups/power?",
    a: "No. Prepare to be \"off-grid\" for the duration. We may have water available upon arrival, but don't plan on it. We'll send nearby locations for water, gas, etc. before the event. Fill up on water and dump your tanks before you arrive.",
  },
  {
    q: "Can I use a generator?",
    a: "Generators will be allowed during certain hours, but we strongly advise against it. Rigs will be parked close together, and generators create irritating and potentially harmful exhaust fumes. Your best source of power will be the sun!",
  },
  {
    q: "Will there be food/alcohol?",
    a: "We invite locally owned/operated food trucks to each event. If you're camping, you may bring your own food & alcohol (alcohol policy may change per event; details provided after ticket purchase). We encourage reusable plates/utensils to minimize waste.",
  },
  {
    q: "Is there cell phone service or wifi?",
    a: "Cell service is highly likely but may vary per venue. Wifi is highly unlikely. Just to be safe, assume you may not have ANY coverage and plan accordingly. We'll have a working phone/internet connection available for emergencies.",
  },
  {
    q: "Are fires allowed?",
    a: "This varies per event based on venue and fire marshal guidelines. We'll always try to get the OK for fires, but check each event page for details. If fires are allowed, you must have a working fire extinguisher in your rig.",
  },
  {
    q: "Can I take pictures / videos / fly a drone?",
    a: "Photos and videos are not only allowed, they're encouraged! Share on socials with #VanFestUSA. Unfortunately, drones are NOT allowed due to liability. Any drones you see are flown by our licensed & insured media partners.",
  },
  {
    q: "Can I help out at VanFest?",
    a: "Absolutely! We have volunteers and a small number of paid positions at every event. Paid positions involve working two or three 8-hour shifts with an hourly wage (1099 contractor), free t-shirt/swag, free camping spot, and one extra free night of camping for training.",
  },
  {
    q: "Is smoking allowed?",
    a: "Tobacco smoking – absolutely not. VanFest events are tobacco-smoke-free. If you must consume tobacco, it needs to be smokeless (vape, dip, etc). Each state has varying laws on other smokable plant materials; we ask that you consume responsibly and respect those around you.",
  },
  {
    q: "Am I allowed to play music?",
    a: "Music is allowed in the camping area at a responsible level, but be considerate. Music should not contain overly offensive language. Quiet hours are from 11pm to 7am, enforced to ensure peaceful enjoyment. When live music is playing, don't play your own at competing volume.",
  },
];

export default function FAQPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 px-4 bg-charcoal">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about VanFest."
            light
          />
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-3xl space-y-6">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group bg-sand rounded-2xl overflow-hidden"
            >
              <summary className="flex items-center justify-between cursor-pointer p-6 font-display font-semibold text-charcoal hover:text-teal transition-colors list-none">
                <span>{faq.q}</span>
                <svg
                  className="w-5 h-5 text-teal flex-shrink-0 ml-4 group-open:rotate-180 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="px-6 pb-6 text-charcoal/70 leading-relaxed text-sm">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
