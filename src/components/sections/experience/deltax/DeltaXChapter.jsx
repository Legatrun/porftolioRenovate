import StageChapter from "../StageChapter";
import DeltaXStage from "./DeltaXStage";

export default function DeltaXChapter(props) {
  return <StageChapter {...props} Stage={DeltaXStage} titleClass="font-mono font-medium uppercase tracking-tighter" />;
}
