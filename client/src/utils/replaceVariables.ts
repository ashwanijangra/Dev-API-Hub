export function replaceVariables(value: string) {
  let result = value;

  try {
    const activeId = localStorage.getItem("devapihub_active_env");
    const envs = localStorage.getItem("devapihub_environments");

    if (activeId && envs) {
      const parsed = JSON.parse(envs);
      const active = parsed.find((e: any) => e.id === activeId);

      if (active?.variables?.length) {
        active.variables.forEach((item: any) => {
          if (item.key?.trim() && item.value?.trim()) {
            result = result.replaceAll(`{{${item.key}}}`, item.value);
          }
        });
      }
    }
  } catch {
    // ignore malformed storage
  }

  return result;
}
