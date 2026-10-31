import StageChapter from "../StageChapter";
import AlphaStage from "./AlphaStage";

export default function AlphaChapter(props) {
  return <StageChapter {...props} Stage={AlphaStage} titleClass="font-sans font-semibold tracking-tight" cardClass="rounded-xl" />;
}
