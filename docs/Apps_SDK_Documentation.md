MCP  
Understand how the Model Context Protocol works with Apps SDK.  
What is MCP?  
The [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) is an open specification for connecting large language model clients to external tools and resources. An MCP server exposes tools that a model can call during a conversation, and return results given specified parameters. Other resources (metadata) can be returned along with tool results, including the inline html that we can use in the Apps SDK to render an interface.  
With Apps SDK, MCP is the backbone that keeps server, model, and UI in sync. By standardising the wire format, authentication, and metadata, it lets ChatGPT reason about your app the same way it reasons about built-in tools.  
Protocol building blocks  
A minimal MCP server for Apps SDK implements three capabilities:

1. List tools – your server advertises the tools it supports, including their JSON Schema input and output contracts and optional annotations.  
2. Call tools – when a model selects a tool to use, it sends a call\_tool request with the arguments corresponding to the user intent. Your server executes the action and returns structured content the model can parse.  
3. Return components – in addition to structured content returned by the tool, each tool (in its metadata) can optionally point to an [embedded resource](https://modelcontextprotocol.io/specification/2025-06-18/server/tools#embedded-resources) that represents the interface to render in the ChatGPT client.

The protocol is transport agnostic, you can host the server over Server-Sent Events or Streamable HTTP. Apps SDK supports both options, but we recommend Streamable HTTP.  
Why Apps SDK standardises on MCP  
Working through MCP gives you several benefits out of the box:

* Discovery integration – the model consumes your tool metadata and surface descriptions the same way it does for first-party connectors, enabling natural-language discovery and launcher ranking. See [Discovery](https://developers.openai.com/apps-sdk/concepts/user-interaction) for details.  
* Conversation awareness – structured content and component state flow through the conversation. The model can inspect the JSON result, refer to IDs in follow-up turns, or render the component again later.  
* Multiclient support – MCP is self-describing, so your connector works across ChatGPT web and mobile without custom client code.  
* Extensible auth – the specification includes protected resource metadata, OAuth 2.1 flows, and dynamic client registration so you can control access without inventing a proprietary handshake.  
* 

User Interaction  
How users find, engage with, activate and manage apps that are available in ChatGPT.  
Discovery  
Discovery refers to the different ways a user or the model can find out about your app and the tools it provides: natural-language prompts, directory browsing, and proactive [entry points](https://developers.openai.com/apps-sdk/concepts/entry-points). Apps SDK leans on your tool metadata and past usage to make intelligent choices. Good discovery hygiene means your app appears when it should and stays quiet when it should not.  
Named mention  
When a user mentions the name of your app at the beginning of a prompt, your app will be surfaced automatically in the response. The user must specify your app name at the beginning of their prompt. If they do not, your app can also appear as a suggestion through in-conversation discovery.  
In-conversation discovery  
When a user sends a prompt, the model evaluates:

* Conversation context – the chat history, including previous tool results, memories, and explicit tool preferences  
* Conversation brand mentions and citations \- whether your brand is explicitly requested in the query or is surfaced as a source/citation in search results.  
* Tool metadata – the names, descriptions, and parameter documentation you provide in your MCP server.  
* User linking state – whether the user already granted access to your app, or needs to connect it before the tool can run.

You influence in-conversation discovery by:

1. Writing action-oriented [tool descriptions](https://modelcontextprotocol.io/specification/2025-06-18/server/tools#tool) (“Use this when the user wants to view their kanban board”) rather than generic copy.  
2. Writing clear [component descriptions](https://developers.openai.com/apps-sdk/reference#add-component-descriptions) on the resource UI template metadata.  
3. Regularly testing your golden prompt set in ChatGPT developer mode and logging precision/recall.

If the assistant selects your tool, it handles arguments, displays confirmation if needed, and renders the component inline. If no linked tool is an obvious match, the model will default to built-in capabilities, so keep evaluating and improving your metadata.  
Directory  
The directory will give users a browsable surface to find apps outside of a conversation. Your listing in this directory will include:

* App name and icon  
* Short and long descriptions  
* Tags or categories (where supported)  
* Optional onboarding instructions or screenshots

Entry points  
Once a user links your app, ChatGPT can surface it through several entry points. Understanding each surface helps you design flows that feel native and discoverable.  
In-conversation entry  
Linked tools are always on in the model’s context. When the user writes a prompt, the assistant decides whether to call your tool based on the conversation state and metadata you supplied. Best practices:

* Keep tool descriptions action oriented so the model can disambiguate similar apps.  
* Return structured content that references stable IDs so follow-up prompts can mutate or summarise prior results.  
* Provide \_meta [hints](https://developers.openai.com/apps-sdk/reference#tool-descriptor-parameters) so the client can streamline confirmation and rendering.

When a call succeeds, the component renders inline and inherits the current theme, composer, and confirmation settings.  
Launcher  
The launcher (available from the \+ button in the composer) is a high-intent entry point where users can explicitly choose an app. Your listing should include a succinct label and icon. Consider:

* Deep linking – include starter prompts or entry arguments so the user lands on the most useful tool immediately.  
* Context awareness – the launcher ranks apps using the current conversation as a signal, so keep metadata aligned with the scenarios you support.

App design guidelines  
Design guidelines for developers building on the Apps SDK.  
Overview  
Apps are developer-built experiences that live inside ChatGPT. They extend what users can do without breaking the flow of conversation, appearing through lightweight cards, carousels, fullscreen views, and other display modes that integrate seamlessly into ChatGPT’s interface while maintaining its clarity, trust, and voice.

These guidelines will give you everything you need to begin building high-quality, consistent, and user-friendly experiences inside ChatGPT.  
Best practices  
Apps are most valuable when they help people accomplish meaningful tasks directly within ChatGPT, without breaking the conversational flow. The goal is to design experiences that feel consistent, useful, and trustworthy while extending ChatGPT in ways that add real value. Good use cases include booking a ride, ordering food, checking availability, or tracking a delivery. These are tasks that are conversational, time bound, and easy to summarize visually with a clear call to action.  
Poor use cases include pasting in long form content from a website, requiring complex multi step workflows, or using the space for ads or irrelevant messaging.  
Principles

* Conversational: Experiences should feel like a natural extension of ChatGPT, fitting seamlessly into the conversational flow and UI.  
* Intelligent: Tools should be aware of conversation context, supporting and anticipating user intent. Responses and UI should feel individually relevant.  
* Simple: Each interaction should focus on a single clear action or outcome. Information and UI should be reduced to the absolute minimum to support the context.  
* Responsive: Tools should feel fast and lightweight, enhancing conversation rather than overwhelming it.  
* Accessible: Designs must support a wide range of users, including those who rely on assistive technologies.

Boundaries  
ChatGPT controls system-level elements such as voice, chrome, styles, navigation, and composer. Developers provide value by customizing content, brand presence, and actions inside the system framework.  
This balance ensures that all apps feel native to ChatGPT while still expressing unique brand value.  
Good use cases  
A good app should answer “yes” to most of these questions:

* Does this task fit naturally into a conversation? (for example, booking, ordering, scheduling, quick lookups)  
* Is it time-bound or action-oriented? (short or medium duration tasks with a clear start and end)  
* Is the information valuable in the moment? (users can act on it right away or get a concise preview before diving deeper)  
* Can it be summarized visually and simply? (one card, a few key details, a clear CTA)  
* Does it extend ChatGPT in a way that feels additive or differentiated?

Poor use cases  
Avoid designing tools that:

* Display long-form or static content better suited for a website or app.  
* Require complex multi-step workflows that exceed the inline or fullscreen display modes.  
* Use the space for ads, upsells, or irrelevant messaging.  
* Surface sensitive or private information directly in a card where others might see it.  
* Duplicate ChatGPT’s system functions (for example, recreating the input composer).

By following these best practices, your tool will feel like a natural extension of ChatGPT rather than a bolt-on experience.  
Display modes  
Display modes are the surfaces developers use to create experiences inside ChatGPT. They allow partners to show content and actions that feel native to conversation. Each mode is designed for a specific type of interaction, from quick confirmations to immersive workflows.  
Using these consistently helps experiences stay simple and predictable.  
Inline  
The inline display mode appears directly in the flow of the conversation. Inline surfaces currently always appear before the generated model response. Every app initially appears inline.

Layout

* Icon & tool call: A label with the app name and icon.  
* Inline display: A lightweight display with app content embedded above the model response.  
* Follow-up: A short, model-generated response shown after the widget to suggest edits, next steps, or related actions. Avoid content that is redundant with the card.

Inline card  
Lightweight, single-purpose widgets embedded directly in conversation. They provide quick confirmations, simple actions, or visual aids.

When to use

* A single action or decision (for example, confirm a booking).  
* Small amounts of structured data (for example, a map, order summary, or quick status).  
* A fully self-contained widget or tool (e.g., an audio player or a score card).

Layout

* Title: Include a title if your card is document-based or contains items with a parent element, like songs in a playlist.  
* Expand: Use to open a fullscreen display mode if the card contains rich media or interactivity like a map or an interactive diagram.  
* Show more: Use to disclose additional items if multiple results are presented in a list.  
* Edit controls: Provide inline support for ChatGPT responses without overwhelming the conversation.  
* Primary actions: Limit to two actions, placed at bottom of card. Actions should perform either a conversation turn or a tool call.

Interaction

Cards support simple direct interaction.

* States: Edits made are persisted.  
* Simple direct edits: If appropriate, inline editable text allows users to make quick edits without needing to prompt the model.  
* Dynamic layout: Card layout can expand its height to match its contents up to the height of the mobile viewport.

Rules of thumb

* Limit primary actions per card: Support up to two actions maximum, with one primary CTA and one optional secondary CTA.  
* No deep navigation or multiple views within a card. Cards should not contain multiple drill-ins, tabs, or deeper navigation. Consider splitting these into separate cards or tool actions.  
* No nested scrolling. Cards should auto-fit their content and prevent internal scrolling.  
* No duplicative inputs. Don’t replicate ChatGPT features in a card.

Inline carousel  
A set of cards presented side-by-side, letting users quickly scan and choose from multiple options.

When to use

* Presenting a small list of similar items (for example, restaurants, playlists, events).  
* Items have more visual content and metadata than will fit in simple rows.

Layout

* Image: Items should always include an image or visual.  
* Title: Carousel items should typically include a title to explain the content.  
* Metadata: Use metadata to show the most important and relevant information about the item in the context of the response. Avoid showing more than two lines of text.  
* Badge: Use the badge to show supporting context where appropriate.  
* Actions: Provide a single clear CTA per item whenever possible.

Rules of thumb

* Keep to 3–8 items per carousel for scannability.  
* Reduce metadata to the most relevant details, with three lines max.  
* Each card may have a single, optional CTA (for example, “Book” or “Play”).  
* Use consistent visual hierarchy across cards.

Fullscreen  
Immersive experiences that expand beyond the inline card, giving users space for multi-step workflows or deeper exploration. The ChatGPT composer remains overlaid, allowing users to continue “talking to the app” through natural conversation in the context of the fullscreen view.

When to use

* Rich tasks that cannot be reduced to a single card (for example, an explorable map with pins, a rich editing canvas, or an interactive diagram).  
* Browsing detailed content (for example, real estate listings, menus).

Layout

* System close: Closes the sheet or view.  
* Fullscreen view: Content area.  
* Composer: ChatGPT’s native composer, allowing the user to follow up in the context of the fullscreen view.

Interaction

* Chat sheet: Maintain conversational context alongside the fullscreen surface.  
* Thinking: The composer input “shimmers” to show that a response is streaming.  
* Response: When the model completes its response, an ephemeral, truncated snippet displays above the composer. Tapping it opens the chat sheet.

Rules of thumb

* Design your UX to work with the system composer. The composer is always present in fullscreen, so make sure your experience supports conversational prompts that can trigger tool calls and feel natural for users.  
* Use fullscreen to deepen engagement, not to replicate your native app wholesale.

Picture-in-picture (PiP)  
A persistent floating window inside ChatGPT optimized for ongoing or live sessions like games or videos. PiP remains visible while the conversation continues, and it can update dynamically in response to user prompts.

When to use

* Activities that run in parallel with conversation, such as a game, live collaboration, quiz, or learning session.  
* Situations where the PiP widget can react to chat input, for example continuing a game round or refreshing live data based on a user request.

Interaction

* Activated: On scroll, the PiP window stays fixed to the top of the viewport  
* Pinned: The PiP remains fixed until the user dismisses it or the session ends.  
* Session ends: The PiP returns to an inline position and scrolls away.

Rules of thumb

* Ensure the PiP state can update or respond when users interact through the system composer.  
* Close PiP automatically when the session ends.  
* Do not overload PiP with controls or static content better suited for inline or fullscreen.

Visual design guidelines  
A consistent look and feel is what makes partner-built tools feel like a natural part of ChatGPT. Visual guidelines ensure partner experiences remain familiar, accessible, and trustworthy, while still leaving room for brand expression in the right places.  
These principles outline how to use color, type, spacing, and imagery in ways that preserve system clarity while giving partners space to differentiate their service.  
Why this matters  
Visual and UX consistency protects the overall user experience of ChatGPT. By following these guidelines, partners ensure their tools feel familiar to users, maintain trust in the system, and deliver value without distraction.  
Color  
System-defined palettes ensure actions and responses always feel consistent with ChatGPT. Partners can add branding through accents, icons, or inline imagery, but should not redefine system colors.

Rules of thumb

* Use system colors for text, icons, and spatial elements like dividers.  
* Partner brand accents such as logos or icons should not override backgrounds or text colors.  
* Avoid custom gradients or patterns that break ChatGPT’s minimal look.  
* Use brand accent colors on primary buttons inside app display modes.

Use brand colors on accents and badges. Don’t change text colors or other core component styles.

Don’t apply colors to backgrounds in text areas.  
Typography  
ChatGPT uses platform-native system fonts (SF Pro on iOS, Roboto on Android) to ensure readability and accessibility across devices.

Rules of thumb

* Always inherit the system font stack, respecting system sizing rules for headings, body text, and captions.  
* Use partner styling such as bold, italic, or highlights only within content areas, not for structural UI.  
* Limit variation in font size as much as possible, preferring body and body-small sizes.

Don’t use custom fonts, even in full screen modes. Use system font variables wherever possible.  
Spacing & layout  
Consistent margins, padding, and alignment keep partner content scannable and predictable inside conversation.

Rules of thumb

* Use system grid spacing for cards, collections, and inspector panels.  
* Keep padding consistent and avoid cramming or edge-to-edge text.  
* Respect system specified corner rounds when possible to keep shapes consistent.  
* Maintain visual hierarchy with headline, supporting text, and CTA in a clear order.

Icons & imagery  
System iconography provides visual clarity, while partner logos and images help users recognize brand context.

Rules of thumb

* Use either system icons or custom iconography that fits within ChatGPT’s visual world — monochromatic and outlined.  
* Do not include your logo as part of the response. ChatGPT will always append your logo and app name before the widget is rendered.  
* All imagery must follow enforced aspect ratios to avoid distortion.

Accessibility  
Every partner experience should be usable by the widest possible audience. Accessibility is a requirement, not an option.  
Rules of thumb

* Text and background must maintain a minimum contrast ratio (WCAG AA).  
* Provide alt text for all images.  
* Support text resizing without breaking layouts.

Tone & proactivity  
Tone and proactivity are critical to how partner tools show up inside ChatGPT. Partners contribute valuable content, but the overall experience must always feel like ChatGPT: clear, helpful, and trustworthy. These guidelines define how your tool should communicate and when it should resurface to users.  
Tone ownership

* ChatGPT sets the overall voice.  
* Partners provide content within that framework.  
* The result should feel seamless: partner content adds context and actions without breaking ChatGPT’s natural, conversational tone.

Content guidelines

* Keep content concise and scannable.  
* Always context-driven: content should respond to what the user asked for.  
* Avoid spam, jargon, or promotional language.  
* Focus on helpfulness and clarity over brand personality.

Proactivity rules  
Proactivity helps users by surfacing the right information at the right time. It should always feel relevant and never intrusive.

* Allowed: contextual nudges or reminders tied to user intent.  
  * Example: “Your order is ready for pickup” or “Your ride is arriving.”  
* Not allowed: unsolicited promotions, upsells, or repeated attempts to re-engage without clear context.  
  * Example: “Check out our latest deals” or “Haven’t used us in a while? Come back.”

Transparency

* Always show why and when your tool is resurfacing.  
* Provide enough context so users understand the purpose of the nudge.  
* Proactivity should feel like a natural continuation of the conversation, not an interruption.

Why this matters  
The way partner tools speak and re-engage defines user trust. A consistent tone and thoughtful proactivity strategy ensure users remain in control, see clear value, and continue to trust ChatGPT as a reliable, helpful interface.  
Research use cases  
Identify and prioritize Apps SDK use cases.  
Why start with use cases  
Every successful Apps SDK app starts with a crisp understanding of what the user is trying to accomplish. Discovery in ChatGPT is model-driven: the assistant chooses your app when your tool metadata, descriptions, and past usage align with the user’s prompt and memories. That only works if you have already mapped the tasks the model should recognize and the outcomes you can deliver.  
Use this page to capture your hypotheses, pressure-test them with prompts, and align your team on scope before you define tools or build components.  
Gather inputs  
Begin with qualitative and quantitative research:

* User interviews and support requests – capture the jobs-to-be-done, terminology, and data sources users rely on today.  
* Prompt sampling – list direct asks (e.g., “show my Jira board”) and indirect intents (“what am I blocked on for the launch?”) that should route to your app.  
* System constraints – note any compliance requirements, offline data, or rate limits that will influence tool design later.

Document the user persona, the context they are in when they reach for ChatGPT, and what success looks like in a single sentence for each scenario.  
Define evaluation prompts  
Decision boundary tuning is easier when you have a golden set to iterate against. For each use case:

1. Author at least five direct prompts that explicitly reference your data, product name, or verbs you expect the user to say.  
2. Draft five indirect prompts where the user states a goal but not the tool (“I need to keep our launch tasks organized”).  
3. Add negative prompts that should not trigger your app so you can measure precision.

Use these prompts later in [Optimize metadata](https://developers.openai.com/apps-sdk/guides/optimize-metadata) to hill-climb on recall and precision without overfitting to a single request.  
Scope the minimum lovable feature  
For each use case decide:

* What information must be visible inline to answer the question or let the user act.  
* Which actions require write access and whether they should be gated behind confirmation in developer mode.  
* What state needs to persist between turns—for example, filters, selected rows, or draft content.

Rank the use cases based on user impact and implementation effort. A common pattern is to ship one P0 scenario with a high-confidence component, then expand to P1 scenarios once discovery data confirms engagement.  
Translate use cases into tooling  
Once a scenario is in scope, draft the tool contract:

* Inputs: the parameters the model can safely provide. Keep them explicit, use enums when the set is constrained, and document defaults.  
* Outputs: the structured content you will return. Add fields the model can reason about (IDs, timestamps, status) in addition to what your UI renders.  
* Component intent: whether you need a read-only viewer, an editor, or a multiturn workspace. This influences the [component planning](https://developers.openai.com/apps-sdk/plan/components) and storage model later.

Review these drafts with stakeholders—especially legal or compliance teams—before you invest in implementation. Many integrations require PII reviews or data processing agreements before they can ship to production.  
Prepare for iteration  
Even with solid planning, expect to revise prompts and metadata after your first dogfood. Build time into your schedule for:

* Rotating through the golden prompt set weekly and logging tool selection accuracy.  
* Collecting qualitative feedback from early testers in ChatGPT developer mode.  
* Capturing analytics (tool calls, component interactions) so you can measure adoption.

These research artifacts become the backbone for your roadmap, changelog, and success metrics once the app is live.  
Define tools  
Plan and define tools for your assistant.  
Tool-first thinking  
In Apps SDK, tools are the contract between your MCP server and the model. They describe what the connector can do, how to call it, and what data comes back. Good tool design makes discovery accurate, invocation reliable, and downstream UX predictable.  
Use the checklist below to turn your use cases into well-scoped tools before you touch the SDK.  
Draft the tool surface area  
Start from the user journey defined in your [use case research](https://developers.openai.com/apps-sdk/plan/use-case):

* One job per tool – keep each tool focused on a single read or write action (“fetch\_board”, “create\_ticket”), rather than a kitchen-sink endpoint. This helps the model decide between alternatives.  
* Explicit inputs – define the shape of inputSchema now, including parameter names, data types, and enums. Document defaults and nullable fields so the model knows what is optional.  
* Predictable outputs – enumerate the structured fields you will return, including machine-readable identifiers that the model can reuse in follow-up calls.

If you need both read and write behavior, create separate tools so ChatGPT can respect confirmation flows for write actions.  
Capture metadata for discovery  
Discovery is driven almost entirely by metadata. For each tool, draft:

* Name – action oriented and unique inside your connector (kanban.move\_task).  
* Description – one or two sentences that start with “Use this when…” so the model knows exactly when to pick the tool.  
* Parameter annotations – describe each argument and call out safe ranges or enumerations. This context prevents malformed calls when the user prompt is ambiguous.  
* Global metadata – confirm you have app-level name, icon, and descriptions ready for the directory and launcher.

Later, plug these into your MCP server and iterate using the [Optimize metadata](https://developers.openai.com/apps-sdk/guides/optimize-metadata) workflow.  
Model-side guardrails  
Think through how the model should behave once a tool is linked:

* Prelinked vs. link-required – if your app can work anonymously, mark tools as available without auth. Otherwise, make sure your connector enforces linking via the onboarding flow described in [Authentication](https://developers.openai.com/apps-sdk/build/auth).  
* Read-only hints – set the [readOnlyHint annotation](https://openaidevs-preview-apps-sdk.vercel.app/apps-sdk/reference#tool-descriptor-parameters) for tools that cannot mutate state so ChatGPT can skip confirmation prompts when possible.  
* Result components – decide whether each tool should render a component, return JSON only, or both. Setting \_meta\["openai/outputTemplate"\] on the tool descriptor advertises the HTML template to ChatGPT.

Golden prompt rehearsal  
Before you implement, sanity-check your tool set against the prompt list you captured earlier:

1. For every direct prompt, confirm you have exactly one tool that clearly addresses the request.  
2. For indirect prompts, ensure the tool descriptions give the model enough context to select your connector instead of a built-in alternative.  
3. For negative prompts, verify your metadata will keep the tool hidden unless the user explicitly opts in (e.g., by naming your product).

Capture any gaps or ambiguities now and adjust the plan—changing metadata before launch is much cheaper than refactoring code later.  
Handoff to implementation  
When you are ready to implement, compile the following into a handoff document:

* Tool name, description, input schema, and expected output schema.  
* Whether the tool should return a component, and if so which UI component should render it.  
* Auth requirements, rate limits, and error handling expectations.  
* Test prompts that should succeed (and ones that should fail).

Bring this plan into the [Set up your server](https://developers.openai.com/apps-sdk/build/mcp-server) guide to translate it into code with the MCP SDK of your choice.  
Design components  
Plan and design UI components that users can interact with.  
Why components matter  
UI components are the human-visible half of your connector. They let users view or edit data inline, switch to fullscreen when needed, and keep context synchronized between typed prompts and UI actions. Planning them early ensures your MCP server returns the right structured data and component metadata from day one.  
Clarify the user interaction  
For each use case, decide what the user needs to see and manipulate:

* Viewer vs. editor – is the component read-only (a chart, a dashboard) or should it support editing and writebacks (forms, kanban boards)?  
* Single-shot vs. multiturn – will the user accomplish the task in one invocation, or should state persist across turns as they iterate?  
* Inline vs. fullscreen – some tasks are comfortable in the default inline card, while others benefit from fullscreen or picture-in-picture modes. Sketch these states before you implement.

Write down the fields, affordances, and empty states you need so you can validate them with design partners and reviewers.  
Map data requirements  
Components should receive everything they need in the tool response. When planning:

* Structured content – define the JSON payload that the component will parse.  
* Initial component state – use window.openai.toolOutput as the initial render data. On subsequent followups that invoke callTool, use the return value of callTool. To cache state for re-rendering, you can use window.openai.setWidgetState.  
* Auth context – note whether the component should display linked-account information, or whether the model must prompt the user to connect first.

Feeding this data through the MCP response is simpler than adding ad-hoc APIs later.  
Design for responsive layouts  
Components run inside an iframe on both desktop and mobile. Plan for:

* Adaptive breakpoints – set a max width and design layouts that collapse gracefully on small screens.  
* Accessible color and motion – respect system dark mode (match color-scheme) and provide focus states for keyboard navigation.  
* Launcher transitions – if the user opens your component from the launcher or expands to fullscreen, make sure navigation elements stay visible.

Document CSS variables, font stacks, and iconography up front so they are consistent across components.  
Define the state contract  
Because components and the chat surface share conversation state, be explicit about what is stored where:

* Component state – use the window.openai.setWidgetState API to persist state the host should remember (selected record, scroll position, staged form data).  
* Server state – store authoritative data in your backend or the built-in storage layer. Decide how to merge server changes back into component state after follow-up tool calls.  
* Model messages – think about what human-readable updates the component should send back via sendFollowupTurn so the transcript stays meaningful.

Capturing this state diagram early prevents hard-to-debug sync issues later.  
Plan telemetry and debugging hooks  
Inline experiences are hardest to debug without instrumentation. Decide in advance how you will:

* Emit analytics events for component loads, button clicks, and validation errors.  
* Log tool-call IDs alongside component telemetry so you can trace issues end to end.  
* Provide fallbacks when the component fails to load (e.g., show the structured JSON and prompt the user to retry).

Once these plans are in place you are ready to move on to the implementation details in [Build a custom UX](https://developers.openai.com/apps-sdk/build/custom-ux).  
Deploy your app  
Learn how to deploy your MCP server  
Deployment options  
Once you have a working MCP server and component bundle, host them behind a stable HTTPS endpoint. Deployment platforms that work well with Apps SDK include:

* Managed containers – Fly.io, Render, or Railway for quick spin-up and automatic TLS.  
* Cloud serverless – Google Cloud Run or Azure Container Apps if you need scale-to-zero, keeping in mind that long cold starts can interrupt streaming HTTP.  
* Kubernetes – for teams that already run clusters. Front your pods with an ingress controller that supports server-sent events.

Regardless of platform, make sure /mcp stays responsive, supports streaming responses, and returns appropriate HTTP status codes for errors.  
Local development  
During development you can expose your local server to ChatGPT using a tunnel such as ngrok:  
ngrok http 2091  
\# https://\<subdomain\>.ngrok.app/mcp → http://127.0.0.1:2091/mcp  
Keep the tunnel running while you iterate on your connector. When you change code:

1. Rebuild the component bundle (npm run build).  
2. Restart your MCP server.  
3. Refresh the connector in ChatGPT settings to pull the latest metadata.

Environment configuration

* Secrets – store API keys or OAuth client secrets outside your repo. Use platform-specific secret managers and inject them as environment variables.  
* Logging – log tool-call IDs, request latency, and error payloads. This helps debug user reports once the connector is live.  
* Observability – monitor CPU, memory, and request counts so you can right-size your deployment.

Dogfood and rollout  
Before launching broadly:

1. Gate access – keep your connector behind developer mode or a Statsig experiment flag until you are confident in stability.  
2. Run golden prompts – exercise the discovery prompts you drafted during planning and note precision/recall changes with each release.  
3. Capture artifacts – record screenshots or screen captures showing the component in MCP Inspector and ChatGPT for reference.

When you are ready for production, update directory metadata, confirm auth and storage are configured correctly, and publish change notes in [Release Notes](https://developers.openai.com/apps-sdk/release-notes).  
Next steps

* Connect your deployed endpoint to ChatGPT using the steps in [Connect from ChatGPT](https://developers.openai.com/apps-sdk/deploy/connect-chatgpt).  
* Validate tooling and telemetry with the [Test your integration](https://developers.openai.com/apps-sdk/deploy/testing) guide.  
* Keep a troubleshooting playbook handy via [Troubleshooting](https://developers.openai.com/apps-sdk/deploy/troubleshooting) so on-call responders can quickly diagnose issues.

Connect from ChatGPT  
Connect your app to ChatGPT clients.  
Before you begin  
Connecting your MCP server to ChatGPT requires developer mode access:

1. Ask your OpenAI partner contact to add you to the connectors developer experiment.  
2. If you are on ChatGPT Enterprise, have your workspace admin enable connector creation for your account.  
3. Toggle Settings → Connectors → Advanced → Developer mode in the ChatGPT client.

Once developer mode is active you will see a Create button under Settings → Connectors.  
Create a connector

1. Ensure your MCP server is reachable over HTTPS (for local development, expose it via ngrok).  
2. In ChatGPT, navigate to Settings → Connectors → Create.  
3. Provide the metadata for your connector:  
   * Connector name – a user-facing title such as Kanban board.  
   * Description – explain what the connector does and when to use it. The model uses this text during discovery.  
   * Connector URL – the public /mcp endpoint of your server (for example https://abc123.ngrok.app/mcp).  
4. Click Create. If the connection succeeds you will see a list of the tools your server advertises. If it fails, use the [Testing](https://developers.openai.com/apps-sdk/deploy/testing) guide to debug with MCP Inspector or the API Playground.

Enable the connector in a conversation

1. Open a new chat in ChatGPT.  
2. Click the \+ button near the message composer and choose Developer mode.  
3. Toggle on your connector in the list of available tools. Linked tools are now available for the assistant to call automatically.  
4. Prompt the model explicitly while you validate the integration. For example, “Use the Kanban board connector to show my tasks.” Once discovery metadata is dialled in you can rely on indirect prompts.

ChatGPT will display tool-call payloads in the UI so you can confirm inputs and outputs. Write tools will require manual confirmation unless you choose to remember approvals for the conversation.  
Refreshing metadata  
Whenever you change your tool list or descriptions:

1. Update your MCP server and redeploy it.  
2. In Settings → Connectors, click into your connector and choose Refresh.  
3. Verify the tool list updates and try a few prompts to ensure discovery still works.

Connecting other clients

* API Playground – visit https://platform.openai.com/playground, open Tools → Add → MCP Server, and paste the same HTTPS endpoint. This is useful when you want raw request/response logs.  
* Mobile clients – once the connector is linked on web it is available on ChatGPT mobile apps as well. Test mobile layouts early if your component has custom controls.

With the connector linked you can move on to validation, experiments, and eventual rollout.  
Test your integration  
Testing strategies for Apps SDK apps.  
Goals  
Testing validates that your connector behaves predictably before you expose it to users. Focus on three areas: tool correctness, component UX, and discovery precision.  
Unit test your tool handlers

* Exercise each tool function directly with representative inputs. Verify schema validation, error handling, and edge cases (empty results, missing IDs).  
* Include automated tests for authentication flows if you issue tokens or require linking.  
* Keep test fixtures close to your MCP code so they stay up to date as schemas evolve.

Use MCP Inspector during development  
The [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector) is the fastest way to debug your server locally:

1. Run your MCP server.  
2. Launch the inspector: npx @modelcontextprotocol/inspector@latest.  
3. Enter your server URL (for example http://127.0.0.1:2091/mcp).  
4. Click List Tools and Call Tool to inspect the raw requests and responses.

Inspector renders components inline and surfaces errors immediately. Capture screenshots for your launch review.  
Validate in ChatGPT developer mode  
After your connector is reachable over HTTPS:

* Link it in Settings → Connectors → Developer mode.  
* Toggle it on in a new conversation and run through your golden prompt set (direct, indirect, negative). Record when the model selects the right tool, what arguments it passed, and whether confirmation prompts appear as expected.  
* Test mobile layouts by invoking the connector in the ChatGPT iOS or Android apps.

Connect via the API Playground  
If you need raw logs or want to test without the full ChatGPT UI, open the [API Playground](https://platform.openai.com/playground):

1. Choose Tools → Add → MCP Server.  
2. Provide your HTTPS endpoint and connect.  
3. Issue test prompts and inspect the JSON request/response pairs in the right-hand panel.

Regression checklist before launch

* Tool list matches your documentation and unused prototypes are removed.  
* Structured content matches the declared outputSchema for every tool.  
* Widgets render without console errors, inject their own styling, and restore state correctly.  
* OAuth or custom auth flows return valid tokens and reject invalid ones with meaningful messages.  
* Discovery behaves as expected across your golden prompts and does not trigger on negative prompts.

Capture findings in a doc so you can compare results release over release. Consistent testing keeps your connector reliable as ChatGPT and your backend evolve.  
Optimize Metadata  
Improve discovery and behavior with rich metadata.  
Why metadata matters  
ChatGPT decides when to call your connector based on the metadata you provide. Well-crafted names, descriptions, and parameter docs increase recall on relevant prompts and reduce accidental activations. Treat metadata like product copy—it needs iteration, testing, and analytics.  
Gather a golden prompt set  
Before you tune metadata, assemble a labelled dataset:

* Direct prompts – users explicitly name your product or data source.  
* Indirect prompts – users describe the outcome they want without naming your tool.  
* Negative prompts – cases where built-in tools or other connectors should handle the request.

Document the expected behaviour for each prompt (call your tool, do nothing, or use an alternative). You will reuse this set during regression testing.  
Draft metadata that guides the model  
For each tool:

* Name – pair the domain with the action (calendar.create\_event).  
* Description – start with “Use this when…” and call out disallowed cases (“Do not use for reminders”).  
* Parameter docs – describe each argument, include examples, and use enums for constrained values.  
* Read-only hint – annotate readOnlyHint: true on tools that never mutate state so ChatGPT can streamline confirmation.

At the app level supply a polished description, icon, and any starter prompts or sample conversations that highlight your best use cases.  
Evaluate in developer mode

1. Link your connector in ChatGPT developer mode.  
2. Run through the golden prompt set and record the outcome: which tool was selected, what arguments were passed, and whether the component rendered.  
3. For each prompt, track precision (did the right tool run?) and recall (did the tool run when it should?).

If the model picks the wrong tool, revise the descriptions to emphasise the intended scenario or narrow the tool’s scope.  
Iterate methodically

* Change one metadata field at a time so you can attribute improvements.  
* Keep a log of revisions with timestamps and test results.  
* Share diffs with reviewers to catch ambiguous copy before you deploy it.

After each revision, repeat the evaluation. Aim for high precision on negative prompts before chasing marginal recall improvements.  
Production monitoring  
Once your connector is live:

* Review tool-call analytics weekly. Spikes in “wrong tool” confirmations usually indicate metadata drift.  
* Capture user feedback and update descriptions to cover common misconceptions.  
* Schedule periodic prompt replays, especially after adding new tools or changing structured fields.

Treat metadata as a living asset. The more intentional you are with wording and evaluation, the easier discovery and invocation become.  
Security & Privacy  
Security and privacy considerations for Apps SDK.  
Principles  
Apps SDK gives your code access to user data, third-party APIs, and write actions. Treat every connector as production software:

* Least privilege – only request the scopes, storage access, and network permissions you need.  
* Explicit user consent – make sure users understand when they are linking accounts or granting write access. Lean on ChatGPT’s confirmation prompts for potentially destructive actions.  
* Defense in depth – assume prompt injection and malicious inputs will reach your server. Validate everything and keep audit logs.

Data handling

* Structured content – include only the data required for the current prompt. Avoid embedding secrets or tokens in component props.  
* Storage – decide how long you keep user data and publish a retention policy. Respect deletion requests promptly.  
* Logging – redact PII before writing to logs. Store correlation IDs for debugging but avoid storing raw prompt text unless necessary.

Prompt injection and write actions  
Developer mode enables full MCP access, including write tools. Mitigate risk by:

* Reviewing tool descriptions regularly to discourage misuse (“Do not use to delete records”).  
* Validating all inputs server-side even if the model provided them.  
* Requiring human confirmation for irreversible operations.

Share your best prompts for testing injections with your QA team so they can probe weak spots early.  
Network access  
Widgets run inside a sandboxed iframe with a strict Content Security Policy. They cannot access privileged browser APIs such as window.alert, window.prompt, window.confirm, or navigator.clipboard. Standard fetch requests are allowed only when they comply with the CSP. Work with your OpenAI partner if you need specific domains allow-listed.  
Server-side code has no network restrictions beyond what your hosting environment enforces. Follow normal best practices for outbound calls (TLS verification, retries, timeouts).  
Authentication & authorization

* Use OAuth 2.1 flows that include PKCE and dynamic client registration when integrating external accounts.  
* Verify and enforce scopes on every tool call. Reject expired or malformed tokens with 401 responses.  
* For built-in identity, avoid storing long-lived secrets; use the provided auth context instead.

Operational readiness

* Run security reviews before launch, especially if you handle regulated data.  
* Monitor for anomalous traffic patterns and set up alerts for repeated errors or failed auth attempts.  
* Keep third-party dependencies (React, SDKs, build tooling) patched to mitigate supply chain risks.

Security and privacy are foundational to user trust. Bake them into your planning, implementation, and deployment workflows rather than treating them as an afterthought.  
App developer guidelines  
Preview guidelines for building apps for ChatGPT.  
Apps SDK is available in preview today for developers to begin building and testing their apps. We will open for app submission later this year.  
Overview  
The ChatGPT app ecosystem is built on trust. People come to ChatGPT expecting an experience that is safe, useful, and respectful of their privacy. Developers come to ChatGPT expecting a fair and transparent process. These developer guidelines set the policies every builder is expected to review and follow.  
Before we get into the specifics, a great ChatGPT app:

* Does something clearly valuable. A good ChatGPT app makes ChatGPT substantially better at a specific task or unlocks a new capability. Our [design guidelines](https://developers.openai.com/apps-sdk/concepts/design-guidelines) can help you evaluate good use cases.  
* Respects users’ privacy. Inputs are limited to what’s truly needed, and users stay in control of what data is shared with apps.  
* Behaves predictably. Apps do exactly what they say they’ll do—no surprises, no hidden behavior.  
* Is safe for a broad audience. Apps comply with [OpenAI’s usage policies](https://openai.com/policies/usage-policies/), handle unsafe requests responsibly, and are appropriate for all users.  
* Is accountable. Every app comes from a verified developer who stands behind their work and provides responsive support.

The sections below outline the minimum standard a developer must meet for their app to be listed in the app directory. Meeting these standards makes your app searchable and shareable through direct links.  
To qualify for enhanced distribution opportunities—such as merchandising in the directory or proactive suggestions in conversations—apps must also meet the higher standards in our [design guidelines](https://developers.openai.com/apps-sdk/concepts/design-guidelines). Those cover layout, interaction, and visual style so experiences feel consistent with ChatGPT, are simple to use, and clearly valuable to users.  
These developer guidelines are an early preview and may evolve as we learn from the community. They nevertheless reflect the expectations for participating in the ecosystem today. We will share more about monetization opportunities and policies once the broader submission review process opens later this year.  
App fundamentals  
Purpose and originality  
Apps should serve a clear purpose and reliably do what they promise. Only use intellectual property that you own or have permission to use. Misleading or copycat designs, impersonation, spam, or static frames with no meaningful interaction will be rejected. Apps should not imply that they are made or endorsed by OpenAI.  
Quality and reliability  
Apps must behave predictably and reliably. Results should be accurate and relevant to user input. Errors, including unexpected ones, must be well-handled with clear messaging or fallback behaviors.  
Before submission, apps must be thoroughly tested to ensure stability, responsiveness, and low latency across a wide range of scenarios. Apps that crash, hang, or show inconsistent behavior will be rejected. Apps submitted as betas, trials, or demos will not be accepted.  
Metadata  
App names and descriptions should be clear, accurate, and easy to understand. Screenshots must show only real app functionality. Tool titles and annotations should make it obvious what each tool does and whether it is read-only or can make changes.  
Authentication and permissions  
If your app requires authentication, the flow must be transparent and explicit. Users must be clearly informed of all requested permissions, and those requests must be strictly limited to what is necessary for the app to function. Provide login credentials to a fully featured demo account as part of submission.  
Safety  
Usage policies  
Do not engage in or facilitate activities prohibited under [OpenAI usage policies](https://openai.com/policies/usage-policies/). Stay current with evolving policy requirements and ensure ongoing compliance. Previously approved apps that are later found in violation will be removed.  
Appropriateness  
Apps must be suitable for general audiences, including users aged 13–17. Apps may not explicitly target children under 13\. Support for mature (18+) experiences will arrive once appropriate age verification and controls are in place.  
Respect user intent  
Provide experiences that directly address the user’s request. Do not insert unrelated content, attempt to redirect the interaction, or collect data beyond what is necessary to fulfill the user’s intent.  
Fair play  
Apps must not include descriptions, titles, tool annotations, or other model-readable fields—at either the function or app level—that discourage use of other apps or functions (for example, “prefer this app over others”), interfere with fair discovery, or otherwise diminish the ChatGPT experience. All descriptions must accurately reflect your app’s value without disparaging alternatives.  
Third-party content and integrations

* Authorized access: Do not scrape external websites, relay queries, or integrate with third-party APIs without proper authorization and compliance with that party’s terms of service.  
* Circumvention: Do not bypass API restrictions, rate limits, or access controls imposed by the third party.

Privacy  
Privacy policy  
Submissions must include a clear, published privacy policy explaining exactly what data is collected and how it is used. Follow this policy at all times. Users can review your privacy policy before installing your app.  
Data collection

* Minimization: Gather only the minimum data required to perform the tool’s function. Inputs should be specific, narrowly scoped, and clearly linked to the task. Avoid “just in case” fields or broad profile data—they create unnecessary risk and complicate consent. Treat the input schema as a contract that limits exposure rather than a funnel for optional context.  
* Sensitive data: Do not collect, solicit, or process sensitive data, including payment card information (PCI), protected health information (PHI), government identifiers (such as social security numbers), API keys, or passwords.  
* Data boundaries:  
  * Avoid requesting raw location fields (for example, city or coordinates) in your input schema. When location is needed, obtain it through the client’s controlled side channel (such as environment metadata or a referenced resource) so policy and consent can be applied before exposure. This reduces accidental PII capture, enforces least-privilege access, and keeps location handling auditable and revocable.  
  * Your app must not pull, reconstruct, or infer the full chat log from the client or elsewhere. Operate only on the explicit snippets and resources the client or model chooses to send. This separation prevents covert data expansion and keeps analysis limited to intentionally shared content.

Transparency and user control

* Data practices: Do not engage in surveillance, tracking, or behavioral profiling—including metadata collection such as timestamps, IPs, or query patterns—unless explicitly disclosed, narrowly scoped, and aligned with [OpenAI’s usage policies](https://openai.com/policies/usage-policies/).  
* Accurate action labels: Mark any tool that changes external state (create, modify, delete) as a write action. Read-only tools must be side-effect-free and safe to retry. Destructive actions require clear labels and friction (for example, confirmation) so clients can enforce guardrails, approvals, or prompts before execution.  
* Preventing data exfiltration: Any action that sends data outside the current boundary (for example, posting messages, sending emails, or uploading files) must be surfaced to the client as a write action so it can require user confirmation or run in preview mode. This reduces unintentional data leakage and aligns server behavior with client-side security expectations.

Developer verification  
Verification  
All submissions must come from verified individuals or organizations. Once the submission process opens broadly, we will provide a straightforward way to confirm your identity and affiliation with any represented business. Repeated misrepresentation, hidden behavior, or attempts to game the system will result in removal from the program.  
Support contact details  
Provide customer support contact details where end users can reach you for help. Keep this information accurate and up to date.  
After submission  
Reviews and checks  
We may perform automated scans or manual reviews to understand how your app works and whether it may conflict with our policies. If your app is rejected or removed, you will receive feedback and may have the opportunity to appeal.  
Maintenance and removal  
Apps that are inactive, unstable, or no longer compliant may be removed. We may reject or remove any app from our services at any time and for any reason without notice, such as for legal or security concerns or policy violations.  
Re-submission for changes  
Once your app is listed in the directory, tool names, signatures, and descriptions are locked. To change or add tools, you must resubmit the app for review.  
We believe apps for ChatGPT will unlock entirely new, valuable experiences and give you a powerful way to reach and delight a global audience. We’re excited to work together and see what you build.  
