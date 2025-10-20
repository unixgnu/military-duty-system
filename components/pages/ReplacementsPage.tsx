'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { RefreshCw } from 'lucide-react';
import { formatDateTime, getShortName } from '@/lib/duty-assignment';

export default function ReplacementsPage() {
  const replacements = useStore((state) => state.replacements);
  const getSoldierById = useStore((state) => state.getSoldierById);
  const getDutyById = useStore((state) => state.getDutyById);

  const sortedReplacements = [...replacements].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>История замен</CardTitle>
        <CardDescription>Все замены солдат в нарядах</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedReplacements.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <RefreshCw className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Нет замен</p>
              <p className="text-sm">История замен пуста</p>
            </div>
          ) : (
            sortedReplacements.map((replacement) => {
              const originalSoldier = getSoldierById(replacement.originalSoldierId);
              const replacementSoldier = getSoldierById(replacement.replacementSoldierId);
              const duty = getDutyById(replacement.dutyId);

              if (!originalSoldier || !replacementSoldier || !duty) return null;

              return (
                <div key={replacement.id} className="p-4 rounded-lg border bg-white/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{duty.type}</Badge>
                        <span className="text-sm text-gray-600">
                          {formatDateTime(new Date(replacement.date))}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="font-medium">
                          {getShortName(originalSoldier.lastName, originalSoldier.firstName, originalSoldier.middleName)}
                        </span>
                        <RefreshCw className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-green-600">
                          {getShortName(replacementSoldier.lastName, replacementSoldier.firstName, replacementSoldier.middleName)}
                        </span>
                      </div>
                      {replacement.reason && (
                        <p className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Причина:</span> {replacement.reason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
