import "server-only";

import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";

import type {
  RotationPlanGradeOutputV1,
  RotationPlanOutputV1,
  RotationPlanPhaseOutputV1,
} from "@/lib/planner/rotation-plan-contract";
import { isRotationPlanExportable } from "@/lib/planner/rotation-plan-schema";

const phaseLabels: Record<RotationPlanPhaseOutputV1["phase"], string> = {
  engage: "Engage",
  focus: "Focus",
  explore_apply: "Explore and Apply",
  reflect: "Reflect",
};

function textParagraph(text: string, bold = false) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text, bold, size: 20 })],
  });
}

function listParagraphs(items: string[]) {
  return items.map((item) => new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text: item, size: 20 })],
  }));
}

function fieldRow(label: string, values: string[], bullets = true, sectionHeading?: string) {
  return new TableRow({
    cantSplit: true,
    children: [
      new TableCell({
        width: { size: 28, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: "F3F1EC" },
        margins: { top: 100, right: 120, bottom: 100, left: 120 },
        children: [
          ...(sectionHeading
            ? [new Paragraph({
              heading: HeadingLevel.HEADING_1,
              spacing: { after: 120 },
              children: [new TextRun({ text: sectionHeading, bold: true, color: "D65A24" })],
            })]
            : []),
          textParagraph(label, true),
        ],
      }),
      new TableCell({
        width: { size: 72, type: WidthType.PERCENTAGE },
        margins: { top: 100, right: 120, bottom: 100, left: 120 },
        children: bullets ? listParagraphs(values) : values.map((value) => textParagraph(value)),
      }),
    ],
  });
}

function headerTable(output: RotationPlanOutputV1) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      fieldRow("School", [output.header.school], false),
      fieldRow("Teacher", [output.header.teacher], false),
      fieldRow("Content", [output.header.content], false),
      fieldRow("Class Rotation Date Range", [output.header.rotation_date_range], false),
    ],
  });
}

function gradeFieldTable(gradePlan: RotationPlanGradeOutputV1) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      fieldRow("Standard(s)", gradePlan.standards, true, gradeHeading(gradePlan.grade)),
      fieldRow("Learning Targets — I can…", gradePlan.learning_targets),
      fieldRow("Success Criteria — I know I am successful when I can…", gradePlan.success_criteria),
      fieldRow("Instructional Resources / Materials", gradePlan.instructional_resources_materials),
      fieldRow("Academic Vocabulary", gradePlan.academic_vocabulary),
      fieldRow("Differentiation", gradePlan.differentiation),
      fieldRow("Assessment Strategies", gradePlan.assessment_strategies),
      fieldRow("Writing Strategies", gradePlan.writing_strategies),
    ],
  });
}

function phaseHeaderCell(text: string, width: number) {
  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.CLEAR, fill: "2B2926", color: "FFFFFF" },
    margins: { top: 100, right: 100, bottom: 100, left: 100 },
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 18 })] })],
  });
}

function phaseRow(phase: RotationPlanPhaseOutputV1) {
  const teacherChildren = [
    ...listParagraphs(phase.teacher_actions),
    ...(phase.transition_or_cleanup
      ? [new Paragraph({ children: [
        new TextRun({ text: "Transition / cleanup: ", bold: true, size: 18 }),
        new TextRun({ text: phase.transition_or_cleanup, size: 18 }),
      ] })]
      : []),
  ];
  return new TableRow({
    children: [
      new TableCell({ width: { size: 18, type: WidthType.PERCENTAGE }, margins: { top: 100, right: 100, bottom: 100, left: 100 }, children: [textParagraph(`${phaseLabels[phase.phase]} (${phase.duration_minutes} min)`, true)] }),
      new TableCell({ width: { size: 41, type: WidthType.PERCENTAGE }, margins: { top: 100, right: 100, bottom: 100, left: 100 }, children: teacherChildren }),
      new TableCell({ width: { size: 41, type: WidthType.PERCENTAGE }, margins: { top: 100, right: 100, bottom: 100, left: 100 }, children: listParagraphs(phase.student_actions) }),
    ],
  });
}

function phaseTable(gradePlan: RotationPlanGradeOutputV1) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          phaseHeaderCell("Lesson Phase", 18),
          phaseHeaderCell("Teacher Actions", 41),
          phaseHeaderCell("Student Actions", 41),
        ],
      }),
      ...gradePlan.phases.map(phaseRow),
    ],
  });
}

function gradeHeading(grade: RotationPlanGradeOutputV1["grade"]) {
  return grade === "K" ? "Kindergarten" : `Grade ${grade}`;
}

export async function renderRotationPlanDocx(output: RotationPlanOutputV1) {
  if (!isRotationPlanExportable(output)) {
    throw new Error("Rotation plan is not complete enough to export.");
  }

  const children = [
    new Paragraph({
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 160 },
      children: [new TextRun({ text: output.title, bold: true, size: 34 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 260 },
      children: [new TextRun({ text: output.shared_rotation_concept, italics: true, size: 21, color: "595550" })],
    }),
    headerTable(output),
    new Paragraph({ spacing: { after: 120 } }),
    ...output.grade_plans.flatMap((gradePlan) => [
      gradeFieldTable(gradePlan),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 220, after: 100 },
        children: [new TextRun({ text: "Lesson Sequence", bold: true })],
      }),
      phaseTable(gradePlan),
      new Paragraph({ spacing: { after: 120 } }),
    ]),
  ];

  const document = new Document({
    creator: "MAPS by Marked Minds",
    title: output.title,
    description: "K–5 Visual Art rotation plan",
    styles: {
      default: {
        document: { run: { font: "Aptos", size: 20 }, paragraph: { spacing: { line: 276 } } },
      },
    },
    sections: [{
      properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
      children,
    }],
  });

  return Packer.toBuffer(document);
}

export function rotationPlanDocxFilename(title: string) {
  const slug = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .toLowerCase();
  return `${slug || "maps-k5-rotation-plan"}-county-plan.docx`;
}
