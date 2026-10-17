import Image from "next/image";
import { plainLabel, staticStatus } from "@/lib/flagshipDisplay";
import type { Flagship } from "@/lib/flagships";
import { getPlateDiagram, whereLine } from "@/lib/projectPlateContent";
import { getProjectScreenshot } from "@/lib/projectScreenshots";
import type { Project } from "@/lib/types";

/**
 * Screenshot plate, or the typographic plate when there is no screenshot (DESIGN.md
 * "Imagery"). Shared by the home features and the /work selected grid.
 */
export function ProjectPlate({
	flagship,
	project,
	sizes,
	priority = false,
}: Readonly<{
	flagship: Flagship;
	project?: Project;
	sizes: string;
	priority?: boolean;
}>) {
	const shot = getProjectScreenshot(flagship.id);
	const Diagram = getPlateDiagram(flagship.id);
	const stack = project?.tags.slice(0, 4).join(", ");

	return (
		<figure className="ePlate">
			{Diagram ? (
				<Diagram />
			) : shot ? (
				<div className="ePlateImg">
					<Image
						src={shot}
						alt={`${flagship.title} screenshot`}
						fill
						sizes={sizes}
						priority={priority}
					/>
				</div>
			) : (
				<div className="eTypeplate">
					<span className="eTypeplateBig">
						{plainLabel(flagship.proof).replace(" · ", ", ")}
					</span>
					<dl>
						{stack && (
							<>
								<dt>stack</dt>
								<dd>{stack}</dd>
							</>
						)}
						{project?.role && (
							<>
								<dt>role</dt>
								<dd>{project.role}</dd>
							</>
						)}
						<dt>status</dt>
						<dd>{staticStatus(flagship).label}</dd>
						<dt>years</dt>
						<dd>{flagship.years}</dd>
					</dl>
				</div>
			)}
			<figcaption>
				<span>{whereLine(flagship)}</span>
				<span>{flagship.years}</span>
			</figcaption>
		</figure>
	);
}
