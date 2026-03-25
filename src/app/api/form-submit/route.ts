import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { FormBuilderData, FormBuilderField } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { sectionId, fields } = await request.json();

    if (!sectionId || !fields) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch section config from DB to prevent spoofing
    const supabase = getSupabaseServer();
    const { data: section } = await supabase
      .from("sections")
      .select("data")
      .eq("id", sectionId)
      .single();

    if (!section) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const formData = section.data as unknown as FormBuilderData;

    if (!formData.submitAction?.toEmail) {
      return NextResponse.json({ error: "Form not configured" }, { status: 500 });
    }

    // Validate required fields
    for (const fieldDef of formData.fields) {
      if (fieldDef.required) {
        const val = fields[fieldDef.name];
        if (!val || (Array.isArray(val) && val.length === 0)) {
          return NextResponse.json({ error: `${fieldDef.label} is required` }, { status: 400 });
        }
      }
    }

    // Build email body
    const emailHtml = buildEmailHtml(formData.fields, fields, formData.submitAction.subject);

    // Send via Resend if API key is available, otherwise fall back to logging
    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@vanfestusa.com";

    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: formData.submitAction.toEmail,
          subject: formData.submitAction.subject || "New Form Submission",
          html: emailHtml,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("Resend error:", err);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
      }
    } else {
      // No Resend key — log the submission
      console.log("Form submission (no RESEND_API_KEY):", {
        to: formData.submitAction.toEmail,
        subject: formData.submitAction.subject,
        fields,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Form submit error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function buildEmailHtml(
  fieldDefs: FormBuilderField[],
  values: Record<string, string | string[]>,
  subject: string
): string {
  const rows = fieldDefs
    .map((f) => {
      const val = values[f.name];
      const display = Array.isArray(val) ? val.join(", ") : (val || "—");
      return `<tr><td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:600;vertical-align:top;white-space:nowrap">${escapeHtml(f.label)}</td><td style="padding:8px 12px;border:1px solid #e2e8f0">${escapeHtml(display)}</td></tr>`;
    })
    .join("");

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#1a1a1a;margin-bottom:16px">${escapeHtml(subject)}</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${rows}
      </table>
      <p style="color:#999;font-size:12px;margin-top:24px">Submitted via vanfestusa.com</p>
    </div>
  `;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
