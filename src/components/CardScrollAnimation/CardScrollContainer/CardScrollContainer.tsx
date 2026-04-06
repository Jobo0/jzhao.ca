import { withChildren } from "@builder.io/react";
import type { PropsWithChildren } from "react";
import React from "react";
import CardScrollAnimationWrapper from "../CardScrollAnimationWrapper";

interface CardScrollContainerProps extends PropsWithChildren {
  numLastElements?: number;
}

const CardScrollContainer = (props: CardScrollContainerProps) => {
  return (
    <CardScrollAnimationWrapper numLastElements={props.numLastElements}>
      {React.Children.toArray(props.children)}
    </CardScrollAnimationWrapper>
  );
};

const CardScrollContainerWithBuilderChildren =
  withChildren(CardScrollContainer);

export default CardScrollContainerWithBuilderChildren;
