import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { CreateCourseData } from "@/lib/course-service";

export type AdminCourseFormValues = CreateCourseData & { previewUrl?: string };

interface AdminCourseFormProps {
  initialValues?: Partial<AdminCourseFormValues>;
  mode: "create" | "edit";
  onSubmit: (values: AdminCourseFormValues) => Promise<void> | void;
  submitting?: boolean;
}

const defaultValues: AdminCourseFormValues = {
  title: "",
  description: "",
  shortDescription: "",
  imageUrl: "",
  price: 0,
  originalPrice: undefined,
  duration: "",
  level: "Beginner",
  category: "",
  // Hidden from UI; kept to satisfy DB requirements
  instructorName: "Course Team",
  instructorBio: "",
  instructorImageUrl: "",
  instructorExperience: "",
  syllabus: [],
  perks: [],
  whatsappGroupLink: "",
  resources: [],
  featured: false,
  previewUrl: "",
};

export const AdminCourseForm = ({ initialValues, mode, onSubmit, submitting }: AdminCourseFormProps) => {
  const [values, setValues] = useState<AdminCourseFormValues>({ ...defaultValues, ...initialValues });
  const [perksText, setPerksText] = useState<string>("");
  const [syllabusLines, setSyllabusLines] = useState<string>("");
  const [resourcesLines, setResourcesLines] = useState<string>("");

  useEffect(() => {
    const merged = { ...defaultValues, ...initialValues } as AdminCourseFormValues;

    // Derive previewUrl from resources if not explicitly provided
    let derivedPreviewUrl = merged.previewUrl || "";
    try {
      if (!derivedPreviewUrl && Array.isArray(merged.resources)) {
        const resources = merged.resources as any[];
        const candidate = resources.find((r: any) => {
          const title = (r?.title || "").toLowerCase();
          const link = (r?.downloadLink || r?.download_link || "").toLowerCase();
          return (
            title.includes("preview") ||
            title.includes("trailer") ||
            link.includes("youtube.com") ||
            link.includes("youtu.be") ||
            link.includes("vimeo.com") ||
            link.endsWith(".mp4")
          );
        });
        if (candidate) {
          derivedPreviewUrl = candidate.downloadLink || candidate.download_link || "";
        }
      }
    } catch {}

    const withPreview = { ...merged, previewUrl: derivedPreviewUrl } as AdminCourseFormValues;
    setValues(withPreview);

    setPerksText((withPreview.perks || []).join("\n"));
    // Flatten syllabus modules into simple topic-per-line input
    const flattenedTopics = (withPreview.syllabus || []).flatMap((m: any) => Array.isArray(m?.topics) ? m.topics : []);
    setSyllabusLines(flattenedTopics.join("\n"));
    // Turn resources into "Title | URL" lines
    const resourceLines = (withPreview.resources || []).map((r: any) => {
      const t = r?.title ?? "";
      const link = r?.downloadLink ?? r?.download_link ?? "";
      return link ? `${t} | ${link}` : t;
    });
    setResourcesLines(resourceLines.join("\n"));
  }, [initialValues]);

  const handleChange = (field: keyof AdminCourseFormValues, v: any) => {
    setValues((prev) => ({ ...prev, [field]: v }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const perks = perksText
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const topics = syllabusLines
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    let resources = resourcesLines
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const parts = line.split("|");
        if (parts.length >= 2) {
          return { title: parts[0].trim(), downloadLink: parts.slice(1).join("|").trim() };
        }
        return { title: line, downloadLink: "" };
      });

    // Ensure the Preview link is present if provided
    const sanitizedPreview = (values.previewUrl || "").trim();
    if (sanitizedPreview) {
      // Remove any existing preview-ish entries to avoid duplicates
      resources = resources.filter((r: any) => !((r?.title || "").toLowerCase().includes("preview")));
      resources.push({ title: "Preview", downloadLink: sanitizedPreview });
    }

    const finalValues: AdminCourseFormValues = {
      ...values,
      perks,
      // Store simplified syllabus as a single module with the provided topics
      syllabus: topics.length > 0 ? [{ module: "Curriculum", topics }] : [],
      resources,
    };

    await onSubmit(finalValues);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={values.title} onChange={(e) => handleChange("title", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" value={values.category} onChange={(e) => handleChange("category", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input id="duration" value={values.duration} onChange={(e) => handleChange("duration", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <select
            id="level"
            className="w-full border rounded-md h-10 px-3 bg-background"
            value={values.level}
            onChange={(e) => handleChange("level", e.target.value as AdminCourseFormValues["level"])}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            value={values.price}
            onChange={(e) => handleChange("price", Number(e.target.value))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="originalPrice">Original Price (optional)</Label>
          <Input
            id="originalPrice"
            type="number"
            value={values.originalPrice ?? ""}
            onChange={(e) => handleChange("originalPrice", e.target.value === "" ? undefined : Number(e.target.value))}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input id="imageUrl" value={values.imageUrl} onChange={(e) => handleChange("imageUrl", e.target.value)} required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="previewUrl">Preview URL</Label>
            {values.previewUrl ? (
              <a
                className="text-sm underline text-primary"
                href={values.previewUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open
              </a>
            ) : null}
          </div>
          <Input
            id="previewUrl"
            placeholder="https://youtu.be/..., https://vimeo.com/..., or .mp4 URL"
            value={values.previewUrl || ""}
            onChange={(e) => handleChange("previewUrl", e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="shortDescription">Short Description</Label>
          <Textarea id="shortDescription" value={values.shortDescription} onChange={(e) => handleChange("shortDescription", e.target.value)} required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={values.description} onChange={(e) => handleChange("description", e.target.value)} required />
        </div>
      </div>

      {/* Instructor fields removed from UI to simplify form. Defaults will be used. */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="perks">Perks (one per line)</Label>
          <Textarea id="perks" value={perksText} onChange={(e) => setPerksText(e.target.value)} placeholder={"Certificate of completion\nHands-on projects"} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsappGroupLink">WhatsApp Group Link</Label>
          <Input id="whatsappGroupLink" value={values.whatsappGroupLink || ""} onChange={(e) => handleChange("whatsappGroupLink", e.target.value)} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="featured">Featured</Label>
            <input
              id="featured"
              type="checkbox"
              className="h-4 w-4"
              checked={values.featured || false}
              onChange={(e) => handleChange("featured", e.target.checked)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="syllabus">Syllabus topics (one per line)</Label>
          <Textarea id="syllabus" value={syllabusLines} onChange={(e) => setSyllabusLines(e.target.value)} placeholder={`Introduction\nGetting Started\nProject 1`} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="resources">Resources (one per line as "Title | URL" or just Title)</Label>
          <Textarea id="resources" value={resourcesLines} onChange={(e) => setResourcesLines(e.target.value)} placeholder={`Course Materials | /resources/materials.pdf\nCode Examples | /resources/code.zip`} />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={!!submitting}>
          {mode === "create" ? (submitting ? "Creating..." : "Create Course") : (submitting ? "Saving..." : "Save Changes")}
        </Button>
      </div>
    </form>
  );
};

export default AdminCourseForm;


