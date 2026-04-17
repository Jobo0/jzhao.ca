import { withChildren } from "@builder.io/react";
import type { PropsWithChildren } from "react";
import React from "react";
import CardScrollAnimationWrapper from "../CardScrollAnimationWrapper";

interface CardScrollContainerProps extends PropsWithChildren {
  numFirstElements?: number;
  numLastElements?: number;
  bottomSeenOffsetPx?: number;
}

const CardScrollContainer = (props: CardScrollContainerProps) => {
  return (
    <CardScrollAnimationWrapper
      numFirstElements={props.numFirstElements}
      numLastElements={props.numLastElements}
      bottomSeenOffsetPx={props.bottomSeenOffsetPx}
    >
      {React.Children.toArray(props.children)}
    </CardScrollAnimationWrapper>
  );
};

const CardScrollContainerWithBuilderChildren =
  withChildren(CardScrollContainer);

export default CardScrollContainerWithBuilderChildren;
