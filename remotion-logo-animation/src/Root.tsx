import { Composition } from "remotion";
import { LogoAnimation } from "./LogoAnimation";

export const RemotionRoot = () => {
  return (
    <Composition
      id="LogoAnimation"
      component={LogoAnimation}
      durationInFrames={105} // 3.5 seconds at 30fps
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
