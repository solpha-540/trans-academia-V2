import { createDemande } from "../components/Api/demandeService";
import { getAgents } from "../components/Api/agentService";
import { getUserInfo } from "../utils/auth";

const SENSITIVE_ROLES = [
  "Chef suivi carriere",
  "Chef formation",
  "Chef Bureau Paie",
];

const isSensitiveRole = (roleLibelle?: string | null): boolean => {
  const r = (roleLibelle || "").trim().toLowerCase();
  return SENSITIVE_ROLES.some((x) => x.toLowerCase() === r);
};

const sanitizeForMessage = (value: any): any => {
  if (value instanceof File) {
    return {
      name: value.name,
      size: value.size,
      type: value.type,
    };
  }

  if (Array.isArray(value)) return value.map(sanitizeForMessage);

  if (value && typeof value === "object") {
    const out: Record<string, any> = {};
    Object.entries(value).forEach(([k, v]) => {
      out[k] = sanitizeForMessage(v);
    });
    return out;
  }

  return value;
};

const buildMessageText = (params: {
  title: string;
  agentTarget?: { id?: number; label?: string };
  motif: string;
  description: string;
  oldData?: any;
  newData?: any;
}) => {
  const oldSafe = params.oldData ? sanitizeForMessage(params.oldData) : undefined;
  const newSafe = params.newData ? sanitizeForMessage(params.newData) : undefined;

  const oldJson = oldSafe ? JSON.stringify(oldSafe, null, 2) : "";
  const newJson = newSafe ? JSON.stringify(newSafe, null, 2) : "";

  const lines: string[] = [];
  lines.push(`Type de modification: ${params.title}`);

  if (params.agentTarget?.id) {
    lines.push(
      `Agent concerné: ${params.agentTarget.label || ""} (ID: ${params.agentTarget.id})`
    );
  }

  lines.push(`Motif: ${params.motif}`);
  lines.push(`Description: ${params.description}`);

  if (oldJson) {
    lines.push("\n--- Anciennes données ---");
    lines.push(oldJson);
  }

  if (newJson) {
    lines.push("\n--- Nouvelles données ---");
    lines.push(newJson);
  }

  return lines.join("\n");
};

export type SecureUpdateDecision = "updated" | "demande_created";

export const secureUpdate = async <TResult>(params: {
  title: string;
  motif?: string;
  description?: string;
  oldData?: any;
  newData?: any;
  agentTarget?: { id?: number; label?: string };
  roleLibelleOverride?: string | null;
  updateFn: () => Promise<TResult>;
}): Promise<{ decision: SecureUpdateDecision; result?: TResult }> => {
  const userInfo = getUserInfo() as any;
  const roleLibelle =
    params.roleLibelleOverride ?? (userInfo?.role_libelle as string | undefined);

  if (!isSensitiveRole(roleLibelle)) {
    const result = await params.updateFn();
    return { decision: "updated", result };
  }

  const agents = await getAgents();
  const drh = (agents as any[]).find(
    (a) => String((a as any)?.role_libelle || "").toLowerCase() === "drh"
  );
  const drhId = drh?.agentId;

  if (!drhId) {
    throw new Error('Impossible de trouver le DRH (role_libelle="DRH")');
  }

  const motif = params.motif?.trim() || "Demande d'autorisation de modification";
  const description =
    params.description?.trim() ||
    "Modification bloquée pour rôle sensible. Validation DRH requise.";

  const messageText = buildMessageText({
    title: params.title,
    agentTarget: params.agentTarget,
    motif,
    description,
    oldData: params.oldData,
    newData: params.newData,
  });

  await createDemande({
    type_demande: "Demande de modification agent",
    message: messageText,
    id_agent_recepteur: Number(drhId),
  });

  return { decision: "demande_created" };
};
