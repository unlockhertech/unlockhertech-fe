# Project Guidelines & Quality Standards

## Core Frontend & React Standards

1. **Button Type Attribute (`typescript:S6850` / `react/button-has-type`):**
   - Always declare an explicit `type="button"`, `type="submit"`, or `type="reset"` on all `<button>` elements.

2. **Component Props Readonly (`typescript:S6759`):**
   - Always type React functional component parameters as `Readonly<Props>` (e.g. `export function MyComp({ ... }: Readonly<Props>)`).

3. **No Nested Ternaries (`typescript:S3358` / `no-nested-ternary`):**
   - Never chain nested ternary operators (`a ? b : c ? d : e`). Extract multi-branch logic into dedicated helper functions or independent control flow.

4. **No Array Indexes in React Keys (`typescript:S6479` / `react/no-array-index-key`):**
   - Never use array indices (`key={index}`, `key={i}`, `key={\`prefix-${i}\`}`) as keys in `.map()`. Use domain IDs, slugs, or stable static values.

5. **Form Controls & Labels (`typescript:S6848` / `jsx-a11y/label-has-associated-control`):**
   - Every `<input>`, `<textarea>`, and `<select>` must have an explicit `id` matching a `<label htmlFor="...">` (use `className="sr-only"` when visually hidden).

6. **Native Dialog Element (`typescript:S6853` / `accessibility:S6853`):**
   - Modals must use native HTML5 `<dialog open ... aria-labelledby="...">` rather than `<div role="dialog" aria-modal="true">`.

7. **Avoid Non-Native Interactive Elements (`typescript:S6845` / `accessibility:S6845`):**
   - Never attach `onClick` or interaction handlers to `<div>`, `<article>`, or static containers. Always use native `<button type="button">` or `<a>` elements for full keyboard, tabbing, and screen-reader accessibility.

8. **Array Index Bounds Safety (`CWE-129` / `typescript:S3796`):**
   - Always verify array bounds before indexing (`>= 0 && < length`, `?? fallback`, `Math.abs(i) % len`). Never access properties on unchecked index elements without null/undefined guards.

9. **Regular Expression Safety & Linear Performance (`typescript:S8786` / `javascript:S5852` / `CWE-1333`):**
   - Never write ambiguous regular expressions with nested quantifiers, overlapping alternatives, or unbounded wildcards that trigger exponential/super-linear backtracking. Use deterministic, linear character classes (`/<[^>]+>/g`, `/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi`).

10. **Limit Cognitive Complexity to ≤ 15 (`javascript:S3776`):**
    - Always decompose complex multi-branch functions, deeply nested loops/conditionals, and massive mappers into single-responsibility helper functions.

11. **Explicit Exception Handling (`javascript:S2486`):**
    - Never write empty catch blocks (`catch {}`, `catch (err) {}`) or silently swallow errors. Always bind the error variable and log contextual information (`console.warn`, `console.debug`, `console.error`) or rethrow.

12. **Top-Level Await & Async/Await (`javascript:S7785` / `javascript:S6793`):**
    - Always use top-level `await` and `async/await` with `try...catch` blocks in ES modules, scripts, and event handlers instead of promise chaining (`.then()`, `.catch()`).

13. **Security & Secrets (`CWE-312`):**
    - Never commit sensitive secrets, credentials, or API keys in code or Terraform configurations. Always retrieve via environment variables or secret vaults.

14. **No Duplicate Branches in Alternations (`javascript:S5857` / `typescript:S5857`):**
    - Never include duplicate characters or identical branches in regular expression alternations (`|`). Ensure every branch in an alternation is unique.

15. **Prefer `String#replaceAll()` over `String#replace()` (`javascript:S6325` / `typescript:S6325`):**
    - When replacing all occurrences of a string literal or single character, always use `replaceAll()` instead of `replace()` with a global regex.

16. **No Duplicate Characters or Overlapping Ranges in Character Classes (`typescript:S5869` / `javascript:S5869`):**
    - Never include duplicate characters or overlapping ranges inside regular expression character classes (`[...]`).

17. **Prefer Optional Chaining (`typescript:S6582` / `javascript:S6582`):**
    - Prefer optional chaining (`obj?.prop`, `(arr?.length ?? 0) > 0`) over verbose `&&` guard expressions.

18. **Cryptographically Safe Random Generation (`typescript:S2245` / `javascript:S2245` / `CWE-338`):**
    - Always use `crypto.randomUUID()` or `crypto.getRandomValues()` instead of `Math.random()` for ID and token generation.

19. **Unambiguous Inline JSX Spacing (`typescript:S6772`):**
    - Ensure whitespace adjacent to inline JSX elements (`<span>`, `<strong>`, `<em>`, `<a>`) is explicit using `{" "}` or template literals.

20. **Synchronized Prop Interfaces & Contracts (`typescript:S2322`):**
    - Always ensure component prop interfaces (`interface ComponentProps`) strictly declare all properties being passed at the call site. Support naming aliases and optional payloads (`prop?: type`) with fallback resolution (`a ?? b ?? default`).

21. **Skill Reference:**
    - Refer to `.agents/skills/frontend-code-quality/SKILL.md` for complete code examples, patterns, and validation checklists.
