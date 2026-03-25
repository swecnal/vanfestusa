"use client";

import { useState } from "react";
import type { FormBuilderData, FormBuilderField, SectionSettings } from "@/lib/types";
import { sectionSpacingStyles, sectionBgClass } from "@/lib/types";
import { textStyleConfigToCSS, type TextStyleConfig } from "@/lib/styles";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
  sectionId: string;
}

export default function FormBuilderSection({ data, settings, sectionId }: Props) {
  const d = data as unknown as FormBuilderData;
  const headingStyle = (data as Record<string, unknown>).headingStyle as TextStyleConfig | undefined;
  const [values, setValues] = useState<Record<string, string | string[]>>({});
  const [humanChecked, setHumanChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const setValue = (name: string, value: string | string[]) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCheckbox = (name: string, option: string) => {
    setValues((prev) => {
      const current = (prev[name] as string[]) || [];
      return {
        ...prev,
        [name]: current.includes(option)
          ? current.filter((v) => v !== option)
          : [...current, option],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (d.recaptcha && !humanChecked) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/form-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId, fields: values }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Submission failed");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section style={sectionSpacingStyles(settings)} className={`px-4 ${sectionBgClass(settings)} ${settings.customClasses || ""}`}>
        <div className={`mx-auto ${settings.maxWidth || "max-w-2xl"} text-center`}>
          <div className="bg-teal/10 border border-teal/20 rounded-xl p-8">
            <svg className="w-12 h-12 text-teal mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-charcoal font-display font-bold text-lg">{d.successMessage || "Thank you!"}</p>
          </div>
        </div>
      </section>
    );
  }

  const inputClass = "w-full px-4 py-3 border border-charcoal/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal text-sm bg-white";

  return (
    <section style={sectionSpacingStyles(settings)} className={`px-4 ${sectionBgClass(settings)} ${settings.customClasses || ""}`}>
      <div className={`mx-auto ${settings.maxWidth || "max-w-2xl"}`}>
        {d.heading && (
          <h2
            className="font-display font-black text-3xl text-charcoal mb-4 text-center"
            style={headingStyle ? textStyleConfigToCSS(headingStyle) : undefined}
            dangerouslySetInnerHTML={{ __html: d.heading }}
          />
        )}
        {d.description && (
          <div className="text-charcoal/70 text-sm leading-relaxed mb-8 text-center site-html-content" dangerouslySetInnerHTML={{ __html: d.description }} />
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          {d.fields.map((field) => (
            <FieldRenderer
              key={field.id}
              field={field}
              value={values[field.name]}
              onChange={setValue}
              onToggleCheckbox={toggleCheckbox}
              inputClass={inputClass}
            />
          ))}

          {d.recaptcha && (
            <label className="flex items-center gap-2 text-sm text-charcoal/70">
              <input
                type="checkbox"
                checked={humanChecked}
                onChange={(e) => setHumanChecked(e.target.checked)}
                className="rounded border-charcoal/30"
              />
              I am a human
            </label>
          )}

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting || (d.recaptcha && !humanChecked)}
            className="w-full bg-teal hover:bg-teal-dark text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : (d.submitButtonText || "Submit")}
          </button>
        </form>
      </div>
    </section>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
  onToggleCheckbox,
  inputClass,
}: {
  field: FormBuilderField;
  value: string | string[] | undefined;
  onChange: (name: string, value: string | string[]) => void;
  onToggleCheckbox: (name: string, option: string) => void;
  inputClass: string;
}) {
  const label = (
    <label className="block text-sm font-semibold text-charcoal mb-1">
      {field.label}
      {field.required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );

  switch (field.type) {
    case "short_text":
      return (
        <div>
          {label}
          <input
            type="text"
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
            value={(value as string) || ""}
            onChange={(e) => onChange(field.name, e.target.value)}
            className={inputClass}
          />
        </div>
      );
    case "long_text":
      return (
        <div>
          {label}
          <textarea
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
            rows={5}
            value={(value as string) || ""}
            onChange={(e) => onChange(field.name, e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </div>
      );
    case "dropdown":
      return (
        <div>
          {label}
          <select
            name={field.name}
            required={field.required}
            value={(value as string) || ""}
            onChange={(e) => onChange(field.name, e.target.value)}
            className={inputClass}
          >
            <option value="">{field.placeholder || "Select..."}</option>
            {field.options.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );
    case "checkboxes":
      return (
        <fieldset>
          <legend className="text-sm font-semibold text-charcoal mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-0.5">*</span>}
          </legend>
          <div className="space-y-2">
            {field.options.map((opt, i) => (
              <label key={i} className="flex items-center gap-2 text-sm text-charcoal/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={((value as string[]) || []).includes(opt)}
                  onChange={() => onToggleCheckbox(field.name, opt)}
                  className="rounded border-charcoal/30 accent-teal"
                />
                {opt}
              </label>
            ))}
          </div>
        </fieldset>
      );
    case "radio":
      return (
        <fieldset>
          <legend className="text-sm font-semibold text-charcoal mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-0.5">*</span>}
          </legend>
          <div className="space-y-2">
            {field.options.map((opt, i) => (
              <label key={i} className="flex items-center gap-2 text-sm text-charcoal/80 cursor-pointer">
                <input
                  type="radio"
                  name={field.name}
                  value={opt}
                  checked={(value as string) === opt}
                  onChange={() => onChange(field.name, opt)}
                  className="border-charcoal/30 accent-teal"
                />
                {opt}
              </label>
            ))}
          </div>
        </fieldset>
      );
    default:
      return null;
  }
}
