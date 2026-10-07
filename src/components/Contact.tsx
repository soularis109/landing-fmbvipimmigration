import { useState } from "react";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { CalendarDays, Check, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { EASE } from "../lib/motion";
import { trackEvent } from "../lib/analytics";
import { useBooking } from "../hooks/useBooking";
import { useLang } from "../hooks/useLang";
import { EMAIL, INSTAGRAM_HANDLE, MAP_EMBED, PHONES, SOCIALS, WHATSAPP_URL } from "../data/content";
import { SplitText } from "./ui/SplitText";

type Field = "name" | "email" | "phone" | "service" | "message";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface FieldProps {
  name: Field;
  label: string;
  value: string;
  error?: string;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onChange: (v: string) => void;
  type?: string;
  as?: "input" | "textarea" | "select";
  options?: string[];
  required?: boolean;
}

function FloatField({ name, label, value, error, focused, onFocus, onBlur, onChange, type = "text", as = "input", options, required }: FieldProps) {
  const floated = focused || value !== "";
  const common = {
    id: `f-${name}`,
    name,
    value,
    onFocus,
    onBlur,
    onChange: (e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement & HTMLSelectElement>) => onChange(e.target.value),
    "aria-invalid": !!error,
    "aria-describedby": error ? `e-${name}` : undefined,
    required,
    className: "w-full bg-transparent pb-2 pt-6 font-body text-base text-ink outline-none focus-visible:outline-none",
  };
  return (
    <div data-field={name} className="relative">
      <label
        htmlFor={`f-${name}`}
        className={`pointer-events-none absolute left-0 origin-left font-body transition-all duration-300 ${floated ? "top-0 text-[0.7rem] tracking-[0.15em] uppercase text-gold" : "top-6 text-base text-ink/50"}`}
      >
        {label}
      </label>
      {as === "textarea" ? (
        <textarea rows={3} {...common} className={`${common.className} resize-none`} />
      ) : as === "select" ? (
        <select {...common} className={`${common.className} appearance-none`}>
          <option value="" />
          {options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input type={type} {...common} />
      )}
      <span className="absolute inset-x-0 bottom-0 h-px bg-ink/20" />
      <motion.span
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-gold"
        initial={false}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      />
      {error && (
        <p id={`e-${name}`} role="alert" className="mt-1 font-body text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export function Contact() {
  const { t } = useLang();
  const booking = useBooking();
  const f = t.contact.form;
  const [scope, animate] = useAnimate();
  const [values, setValues] = useState<Record<Field, string>>({ name: "", email: "", phone: "", service: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [focus, setFocus] = useState<Field | null>(null);
  const [status, setStatus] = useState<"idle" | "done">("idle");

  const set = (k: Field) => (v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<Field, string>> = {};
    if (!values.name.trim()) next.name = f.errName;
    if (!EMAIL_RE.test(values.email.trim())) next.email = f.errEmail;
    setErrors(next);
    const bad = Object.keys(next) as Field[];
    if (bad.length) {
      bad.forEach((k) => animate(`[data-field="${k}"]`, { x: [0, -6, 6, -4, 4, 0] }, { duration: 0.4 }));
      return;
    }
    // TODO: connect to backend / Formspree / CRM
    setStatus("done");
    trackEvent("contact_form_submit");
  };

  const fieldProps = (k: Field, label: string, extra: Partial<FieldProps> = {}): FieldProps => ({
    name: k,
    label,
    value: values[k],
    error: errors[k],
    focused: focus === k,
    onFocus: () => setFocus(k),
    onBlur: () => setFocus(null),
    onChange: set(k),
    ...extra,
  });

  const rows = [
    { icon: MapPin, content: <span>{t.contact.address}</span> },
    {
      icon: Phone,
      content: (
        <span className="flex flex-wrap gap-x-3">
          {PHONES.map((p, i) => (
            <span key={p.href}>
              <a href={p.href} className="hover:text-sea">
                {p.label}
              </a>
              {i < PHONES.length - 1 && <span className="ml-3 text-ink/30">·</span>}
            </span>
          ))}
        </span>
      ),
    },
    {
      icon: Mail,
      content: (
        <a href={`mailto:${EMAIL}`} className="hover:text-sea">
          {EMAIL}
        </a>
      ),
    },
    {
      icon: Instagram,
      content: (
        <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-sea">
          {INSTAGRAM_HANDLE}
        </a>
      ),
    },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-sand px-5 py-20 md:px-12 md:py-28">
      <div className="mx-auto grid max-w-[1440px] gap-16 md:grid-cols-2">
        <div>
          <p className="eyebrow mb-6">{t.contact.eyebrow}</p>
          <h2 id="contact-title" className="h2-display mb-10">
            <SplitText text={t.contact.title} />
          </h2>
          <ul className="space-y-5">
            {rows.map(({ icon: Icon, content }, i) => (
              <li key={i} className="flex items-start gap-4 font-body text-base text-ink/80 md:text-lg">
                <Icon size={20} className="mt-1 shrink-0 text-gold" aria-hidden />
                {content}
              </li>
            ))}
          </ul>
          <iframe
            title={t.contact.mapTitle}
            src={MAP_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="mt-10 h-72 w-full rounded-2xl border-0 grayscale transition-[filter] duration-700 hover:grayscale-0"
          />
        </div>

        <div>
          <form ref={scope} onSubmit={submit} noValidate className="rounded-2xl bg-ivory p-6 shadow-sm md:p-8">
            <div className="space-y-6">
              <FloatField {...fieldProps("name", f.name, { required: true })} />
              <FloatField {...fieldProps("email", f.email, { type: "email", required: true })} />
              <FloatField {...fieldProps("phone", f.phone, { type: "tel" })} />
              <FloatField
                {...fieldProps("service", f.service, {
                  as: "select",
                  options: t.services.items.map((s) => s.title),
                })}
              />
              <FloatField {...fieldProps("message", f.message, { as: "textarea" })} />
            </div>

            <div className="mt-8 flex items-center gap-4">
              <motion.button
                type="submit"
                disabled={status === "done"}
                layout
                className="flex h-14 items-center justify-center rounded-full bg-gold font-body text-sm font-semibold text-navy"
                animate={{ width: status === "done" ? 56 : 200 }}
                transition={{ duration: 0.5, ease: EASE }}
                aria-label={status === "done" ? f.success : f.submit}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {status === "done" ? (
                    <motion.span key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Check size={22} />
                    </motion.span>
                  ) : (
                    <motion.span key="send" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {f.submit}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              <AnimatePresence>
                {status === "done" && (
                  <motion.p
                    role="status"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
                    className="font-body text-sm text-ink/80"
                  >
                    {f.success}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>

          <button
            type="button"
            onClick={() => booking.open("contact")}
            className="mt-5 flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl border border-navy/30 px-6 py-4 font-display text-2xl text-navy transition-colors hover:bg-navy hover:text-sand md:text-3xl"
          >
            <CalendarDays size={26} className="text-gold" aria-hidden />
            {t.booking.bookConsultation}
          </button>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("whatsapp_click", { source: "contact" })}
            className="mt-5 flex min-h-16 items-center justify-center gap-3 rounded-2xl bg-navy px-6 py-4 font-display text-2xl text-sand transition-colors hover:bg-navy-2 md:text-3xl"
          >
            <MessageCircle size={26} className="text-gold" aria-hidden />
            {f.whatsapp}
          </a>
        </div>
      </div>
    </section>
  );
}
