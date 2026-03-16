import React from "react";
import { CheckCircle2, Circle, PlayCircle, Clock } from "lucide-react";

export interface TimelineStage {
  id: string;
  label: string;
  status: "completed" | "pending" | "current";
  completedAt?: string;
}

interface TimelineProps {
  stages: TimelineStage[];
  onInitiate: (stageId: string) => void;
  loadingStageId?: string | null;
}

export const Timeline: React.FC<TimelineProps> = ({
  stages,
  onInitiate,
  loadingStageId,
}) => {
  return (
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100" />

      <div className="space-y-8">
        {stages.map((stage, index) => {
          const isLast = index === stages.length - 1;
          const isCompleted = stage.status === "completed";
          const isCurrent = stage.status === "current";

          return (
            <div
              key={stage.id}
              className="relative flex gap-4 items-start group"
            >
              {/* Icon Container */}
              <div className="relative z-10 flex items-center justify-center">
                {isCompleted ? (
                  <div className="bg-green-100 p-1 rounded-full text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                ) : isCurrent ? (
                  <div className="bg-blue-100 p-1 rounded-full text-blue-600 animate-pulse">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-1 rounded-full text-slate-300 ring-4 ring-white">
                    <Circle className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-0.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4
                      className={`text-sm font-bold ${
                        isCompleted
                          ? "text-slate-900"
                          : isCurrent
                            ? "text-blue-700"
                            : "text-slate-400"
                      }`}
                    >
                      {stage.label}
                    </h4>
                    {/* {isCompleted && stage.completedAt && (
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-medium">
                        <Clock className="w-3 h-3" />
                        {stage.completedAt}
                      </div>
                    )} */}
                  </div>

                  {!isCompleted && !isLast && (
                    <button
                      onClick={() => onInitiate(stage.id)}
                      disabled={loadingStageId === stage.id}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold hover:bg-blue-100 transition-colors active:scale-95 shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loadingStageId === stage.id ? (
                        <Clock className="w-3 h-3 animate-spin" />
                      ) : (
                        <PlayCircle className="w-3 h-3" />
                      )}
                      {loadingStageId === stage.id
                        ? "Initiating..."
                        : "Initiate"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
