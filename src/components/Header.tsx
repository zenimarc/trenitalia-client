import React, { useState } from "react";
import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import ButtonAsLink from "./ButtonAsLink";
import BurgerIcon from "./BurgerIcon";

const HeaderBar = styled.header`
  width: 100%;
  padding: 0em 1em;
  display: flex;
  height: 64px;
  position: fixed;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.25);
  z-index: 1;
`;
const LogoText = styled.div`
  margin: 0;
  padding: 0;
  display: inline;
`;

const BurgerWrapper = styled.div`
  display: none;
  @media (max-width: 700px) {
    display: block;
    position: absolute;
    top: 1em;
    right: 1em;
  }
`;

const UserState = styled.div`
  margin-left: auto;
`;

const handleBurgerClick = () => {
  window.document.querySelector("#navlist")?.classList.toggle("d-none");
};

const Header = () => {
  return (
    <HeaderBar>
      <LogoText>
        <img
          src={
            "https://www.trenitalia.com/content/dam/tcom/asset/icon/header-logo/logo-trenitalia.svg"
          }
          alt="Logo"
          style={{ width: 150 }}
        />
      </LogoText>
      <div style={{ padding: 0, marginTop: "0.8em", marginLeft: "0.5em" }}>
        le coincidenze non esistono
      </div>
      <BurgerWrapper id="burger-menu" onClick={handleBurgerClick}>
        <BurgerIcon />
      </BurgerWrapper>
    </HeaderBar>
  );
};

export default Header;
