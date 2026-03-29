# /ux-bar

## A. Intent
Set a minimum UX quality bar with clear criteria before UI implementation.

## B. When to Use
Use when a feature has user-facing interaction or visual design impact.

## C. Required Inputs
- Target user flow
- Existing design language
- Accessibility requirements

## D. Deterministic Execution Flow
1. Evaluate key interaction states.
2. Check visual hierarchy and clarity.
3. Validate accessibility coverage.
4. Identify UX risks and gaps.
5. Emit UX quality checklist.

## E. Structured Output Template
- `ux_scorecard[]`
- `interaction_states[]`
- `accessibility_checks[]`
- `ux_gaps[]`
- `improvements[]`

## F. Stop Conditions
- Critical flow has undefined state handling.
- Accessibility constraints are missing.

## G. Safety Constraints
- Preserve existing design system patterns unless an explicit redesign is approved.
