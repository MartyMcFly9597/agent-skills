# Model Selection Guidance

Model availability and selection are configured by the user or the environment. A prompt or skill cannot enforce which model runs or restrict its tool access.

For workflows where independent review materially improves confidence, use a different model family for review when one is available. If model choice matters to the task, record the choice and any limitation in the task output rather than asking the model to attest to its identity.

Use the smallest context and least-complex model that can perform the task reliably. Escalate only when a specific verification or reasoning attempt demonstrates the need, and return to the ordinary model choice for later work.