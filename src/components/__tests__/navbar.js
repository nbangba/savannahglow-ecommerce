/**
 * @jest-environment jsdom
 */

import React from "react"
import renderer from "react-test-renderer"

import Navbar from "../navbar"


describe("Header", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(<Navbar />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})