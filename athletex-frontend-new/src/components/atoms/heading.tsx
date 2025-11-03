import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  text: React.ReactNode;
  className?: string;
};

const Heading = (props: Props) => {
  return (
    <h2 className={cn("text-xl md:text-[29px] font-semibold", props.className)}>
      {props.text}
    </h2>
  );
};

export default Heading;
