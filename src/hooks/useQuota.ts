"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import type { UserLimits } from "@/types";

interface QuotaState {
  limits: UserLimits | null;
  usedToday: number;
  loading: boolean;
}

export function useQuota() {
  const [state, setState] = useState<QuotaState>({
    limits: null,
    usedToday: 0,
    loading: true,
  });

  const fetchQuota = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const result = await api.get<{ limits: UserLimits; used_today: number }>("/user/quota");
      if (result.success && result.data) {
        setState({
          limits: result.data.limits,
          usedToday: result.data.used_today,
          loading: false,
        });
      } else {
        setState({ limits: null, usedToday: 0, loading: false });
      }
    } catch {
      setState({ limits: null, usedToday: 0, loading: false });
    }
  }, []);

  useEffect(() => {
    fetchQuota();
  }, [fetchQuota]);

  const remaining = state.limits
    ? Math.max(0, state.limits.daily_tasks - state.usedToday)
    : 0;

  const percentage = state.limits
    ? Math.min(100, (state.usedToday / state.limits.daily_tasks) * 100)
    : 0;

  return {
    limits: state.limits,
    usedToday: state.usedToday,
    remaining,
    percentage,
    loading: state.loading,
    refresh: fetchQuota,
  };
}
