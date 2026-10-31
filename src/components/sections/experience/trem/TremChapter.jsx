import StageChapter from "../StageChapter";
import TremStage from "./TremStage";

export default function TremChapter(props) {
  return (
    <StageChapter
      {...props}
      Stage={TremStage}
      tone="light"
      titleClass="font-display font-medium uppercase tracking-[0.08em]"
    />
  );
}
