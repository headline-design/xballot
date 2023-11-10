import React, { useState } from "react";
import styled from "styled-components";

const DropDownContainer = styled("div")`
  width: 10.5em;
  margin: 0 auto;

`;

const DropDownHeader = styled("button")`
  margin-bottom: 0.8em;
  padding: 0.4em 2em 0.4em 1em;
  font-weight: 500;
  font-size: 1.3rem;
  cursor: pointer;
  border-radius: 16px;
  color: var(--clr-text-1);
  fill: var(--clr-text-1);
  display: flex;
  border-width: 1px;
  border-style: solid;
  background-color: var(--clr-bg-lighter);
  border-color: var(--border);
  &:hover {
    border-radius: 14px;
    box-shadow: var(--box-shadow-1);
    border-color: var(--primary-color-lightest-2);
    border-width: 1px;
    border-style: solid;
    background: var(--btn-bg-1)!important;
    color: var(--clr-text-4)!important;
    transition: border-color .2s ease-in-out;
  &:focus {
    border-radius: 14px;
    box-shadow: var(--box-shadow-1);
    border-width: 1px;
    border-style: solid;
    border-color: var(--primary-color-2)!important;
    background-color: var(--bg-color-active)!important;
    color: var(--clr-text-4)!important;
    transition: border-color .2s ease-in-out;
  }
}
`;

const DropDownListContainer = styled("div")`
min-width: 196px;
    max-height: 350px;
    overflow: auto;
    border-radius: 12px;
    flex-direction: column;
    font-size: 16px;
    position: absolute;
    z-index: 100;
    border: 1px solid;
    background-color: var(--clr-bg-lighter);
    border-color: var(--border);
    box-shadow: rgb(0 0 0/12%)0 5px 10px 0;

`;

const DropDownList = styled("ul")`
min-width: 196px;
    max-height: 350px;
    padding: .5rem;
    overflow: auto;
    border-radius: 12px;
    flex-direction: column;
    font-size: 16px;
    z-index: 100;
    padding: 0.5rem;
  &:first-child {
    padding-top: 0.8em;
  }
`;

const ListItem = styled("li")`
  list-style: none;
  text-decoration: none;
    cursor: pointer;
    font-weight: 500;
    color: var(--uni-body-color);
    text-align: left;
    padding: 6px;
    border-radius:.5rem;
  &:hover {
    color: var(--clr-text-4);
    cursor: pointer;
    text-decoration: none;
    transition: all .2s ease-in-out;
    background-color: var(--wallet-1);
    border-radius:.5rem;
  }
`;

const options = ["Mangoes", "Apples", "Oranges"];

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = value => () => {
    setSelectedOption(value);
    setIsOpen(false);
  };

  return (
<div>
      <DropDownContainer>
        <DropDownHeader onClick={toggling}>
          {selectedOption || "Mangoes"}
        </DropDownHeader>
        {isOpen && (
          <DropDownListContainer>
            <DropDownList>
              {options.map(option => (
                <ListItem onClick={onOptionClicked(option)} key={Math.random()}>
                  {option}
                </ListItem>
              ))}
            </DropDownList>
          </DropDownListContainer>
        )}
      </DropDownContainer>
      </div>
  );
}