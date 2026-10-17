import type { ComponentType } from "react";
import { SecurityPlatformDiagram } from "@/components/editorial/SecurityPlatformDiagram";
import { hostOf } from "@/lib/flagshipDisplay";
import type { Flagship } from "@/lib/flagships";
import type { Project } from "@/lib/types";

const DIAGRAMS = {
	"security-readiness-platform": SecurityPlatformDiagram,
} satisfies Record<string, ComponentType>;

/** Diagram that stands in for a screenshot, if this project has one. */
export function getPlateDiagram(id: string): ComponentType | undefined {
	return DIAGRAMS[id];
}

/** Where the work can be seen, for the flagship plate caption. */
export function whereLine(flagship: Flagship): string {
	if (flagship.status === "live") return hostOf(flagship.statusUrl);
	if (flagship.status === "npm") return flagship.statusSub;
	if (flagship.status === "cli") return "Private CLI, source on request";
	if (flagship.id === "security-readiness-platform")
		return "Private: client confidential";
	return "Client sites, not shown here";
}

/** Caption for a case-study plate, including projects that cannot be shown publicly. */
export function plateCaption(
	project: Project,
	screenshotPath: string | undefined,
	host: string,
): string {
	if (screenshotPath) return host || "Screenshot";
	if (project.id === "security-readiness-platform")
		return "Private: client confidential";
	if (project.links?.live) return "No screenshot published";
	if (project.company) return "Not shown publicly";
	return "No public view of this one";
}
