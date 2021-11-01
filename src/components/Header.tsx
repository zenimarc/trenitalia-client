import React, { useState } from "react";
import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import ButtonAsLink from "./ButtonAsLink";

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
const LogoText = styled.h1`
  margin: 0;
  padding: 0;
  display: inline;
`;

const UserState = styled.div`
  margin-left: auto;
`;

const Header = () => {
  return (
    <HeaderBar>
      <LogoText>Trenitalia</LogoText>
      <div style={{ padding: 0, marginTop: "0.8em", marginLeft: "0.5em" }}>
        le coincidenze non esistono
      </div>
    </HeaderBar>
  );
};

export default Header;
