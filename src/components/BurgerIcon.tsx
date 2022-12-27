import React from "react";
import styled from "styled-components";

const BurgerIconWrapper = styled.div`
  width: 40px;
  height: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
`;

const BurgerLine = styled.div`
  width: 40px;
  height: 5px;
  background-color: black;
`;

const BurgerIcon = ({ style }: { style?: React.CSSProperties }) => {
  return (
    <BurgerIconWrapper style={style}>
      <BurgerLine />
      <BurgerLine />
      <BurgerLine />
    </BurgerIconWrapper>
  );
};

export default BurgerIcon;
