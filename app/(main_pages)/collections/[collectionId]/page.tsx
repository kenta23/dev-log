import { getLogsByCollectionId } from "@/actions/entries";
import LogsItem from "@/components/logsitem";

export default async function page({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) {
  const { collectionId } = await params;

  const logsByCollectionId = await getLogsByCollectionId(Number(collectionId));

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <LogsItem logs={logsByCollectionId} />
      </div>
    </div>
  );
}
