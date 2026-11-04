import React, { createContext, useContext, useEffect, useState } from "react";
import {
  DemandeHistoryItem,
  DemandePayload,
} from "../types/demandeType";
import {
  createDemande as apiCreateDemande,
  getDemandesByDemandeur,
  getDemandesByRecepteur,
} from "../components/Api/demandeService";
import { getAgentId, getUserInfo } from "../utils/auth";
import { getAgents } from "../components/Api/agentService";
import type { Agent } from "../types/agentType";

interface DemandeContextType {
  demandeurAgent: Agent | null;
  demandeurId: number | null;

  recepteurId: number | null;
  setRecepteurId: (id: number | null) => void;

  sentDemandes: DemandeHistoryItem[];
  receivedDemandes: DemandeHistoryItem[];

  loading: boolean;
  error: string | null;

  createDemande: (payload: DemandePayload) => Promise<void>;
  refreshHistories: () => Promise<void>;
}

const DemandeContext = createContext<DemandeContextType | undefined>(undefined);

export const DemandeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const userInfo = getUserInfo() as Agent | null;

  const getAgentIdFromUserInfo = (u: any): number | null => {
    const candidates = [
      u?.id_op_agent,
      u?.agentId,
      u?.id_agent,
      u?.id,
      u?.identite?.id_op_agent,
      u?.identite?.agentId,
    ];
    for (const c of candidates) {
      const n = Number(c);
      if (Number.isFinite(n) && n > 0) return n;
    }
    return null;
  };

  // Adapt this according to your userInfo structure:
  const demandeurAgent: Agent | null = userInfo;
  const storedAgentId = getAgentId();
  const parsedStoredAgentId = storedAgentId ? Number(storedAgentId) : NaN;
  const demandeurId: number | null =
    Number.isFinite(parsedStoredAgentId) && parsedStoredAgentId > 0
      ? parsedStoredAgentId
      : userInfo
        ? getAgentIdFromUserInfo(userInfo)
        : null;

  const [recepteurId, setRecepteurId] = useState<number | null>(null);

  useEffect(() => {
    const role = String((userInfo as any)?.role_libelle || "")
      .trim()
      .toLowerCase();

    if (role === "drh" && recepteurId == null) {
      const stored = getAgentId();
      const storedParsed = stored ? Number(stored) : NaN;
      const id =
        Number.isFinite(storedParsed) && storedParsed > 0
          ? storedParsed
          : getAgentIdFromUserInfo(userInfo);
      if (id) setRecepteurId(id);
    }
  }, [recepteurId, userInfo]);

  useEffect(() => {
    const role = String((userInfo as any)?.role_libelle || "")
      .trim()
      .toLowerCase();

    if (role !== "drh" || recepteurId != null || !userInfo) return;

    let cancelled = false;
    (async () => {
      try {
        const agents = await getAgents();
        if (cancelled) return;

        const currentAgentId = demandeurId;

        const currentMail = String((userInfo as any)?.mail || (userInfo as any)?.email || "")
          .trim()
          .toLowerCase();

        const currentNom = String((userInfo as any)?.nom || "").trim().toLowerCase();
        const currentPostNom = String((userInfo as any)?.postNom || (userInfo as any)?.post_nom || "")
          .trim()
          .toLowerCase();
        const currentPrenom = String((userInfo as any)?.prenom || "").trim().toLowerCase();

        const found = (agents as any[]).find((a) => {
          const aRole = String((a as any)?.role_libelle || "").trim().toLowerCase();
          if (aRole !== "drh") return false;

          const aAgentId = Number(
            (a as any)?.agentId ?? (a as any)?.id_op_agent ?? (a as any)?.id_agent ?? (a as any)?.id
          );
          if (currentAgentId && Number.isFinite(aAgentId) && aAgentId === currentAgentId) {
            return true;
          }

          const aMail = String((a as any)?.mail || (a as any)?.email || "")
            .trim()
            .toLowerCase();
          if (currentMail && aMail && aMail === currentMail) return true;

          const aNom = String((a as any)?.nom || "").trim().toLowerCase();
          const aPostNom = String((a as any)?.postNom || (a as any)?.post_nom || "")
            .trim()
            .toLowerCase();
          const aPrenom = String((a as any)?.prenom || "").trim().toLowerCase();

          return !!currentNom && aNom === currentNom && aPostNom === currentPostNom && aPrenom === currentPrenom;
        });

        const resolvedId = found ? Number((found as any)?.id_op_agent ?? (found as any)?.agentId) : null;
        if (resolvedId && Number.isFinite(resolvedId) && resolvedId > 0) {
          setRecepteurId(resolvedId);
        }
      } catch (e) {
        console.error("[DemandeContext] Impossible de résoudre recepteurId DRH via getAgents", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [demandeurId, recepteurId, userInfo]);

  const [sentDemandes, setSentDemandes] = useState<DemandeHistoryItem[]>([]);
  const [receivedDemandes, setReceivedDemandes] = useState<DemandeHistoryItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistories = async () => {
    try {
      console.log("[DemandeContext] loadHistories", {
        demandeurId,
        recepteurId,
        role_libelle: (userInfo as any)?.role_libelle,
      });
      setLoading(true);
      setError(null);

      const [sentRaw, receivedRaw] = await Promise.all([
        demandeurId ? getDemandesByDemandeur(demandeurId) : Promise.resolve([]),
        recepteurId ? getDemandesByRecepteur(recepteurId) : Promise.resolve([]),
      ]);

      const sent: DemandeHistoryItem[] = (sentRaw as DemandeHistoryItem[]).map((d) => ({
        ...d,
        direction: "sent",
      }));

      const received: DemandeHistoryItem[] = (receivedRaw as DemandeHistoryItem[]).map((d) => ({
        ...d,
        direction: "received",
      }));

      setSentDemandes(sent);
      setReceivedDemandes(received);
    } catch (err: any) {
      setError(err?.message || "Erreur lors du chargement des demandes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (demandeurId || recepteurId) loadHistories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demandeurId, recepteurId]);

  const createDemande = async (payload: DemandePayload) => {
    await apiCreateDemande(payload);
    // Refresh after create
    await loadHistories();
  };

  const value: DemandeContextType = {
    demandeurAgent,
    demandeurId,
    recepteurId,
    setRecepteurId,
    sentDemandes,
    receivedDemandes,
    loading,
    error,
    createDemande,
    refreshHistories: loadHistories,
  };

  return (
    <DemandeContext.Provider value={value}>
      {children}
    </DemandeContext.Provider>
  );
};

export const useDemandeContext = (): DemandeContextType => {
  const ctx = useContext(DemandeContext);
  if (!ctx) {
    throw new Error("useDemandeContext must be used within a DemandeProvider");
  }
  return ctx;
};