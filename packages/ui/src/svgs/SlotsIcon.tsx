import * as React from "react";
import type { SVGProps } from "react";

const SvgSlotsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 21"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M15.745 3.554a2.13 2.13 0 0 1 2.127-2.132 2.132 2.132 0 0 1 .851 4.086v4.867c0 .471-.38.853-.85.853H16.17v1.36c0 .222-.087.433-.243.59l-.608.608v5.117c0 .47-.38.852-.85.852h-1.703a.852.852 0 0 1-.851-.852v-1.706a.852.852 0 0 0-.851-.853H5.106a.852.852 0 0 0-.85.853v1.706c0 .47-.382.852-.852.852H1.702a.852.852 0 0 1-.85-.852v-5.117l-.608-.608a.834.834 0 0 1-.244-.59v-4.77c0-.472.381-.853.851-.853H15.32c.47 0 .851.381.851.852v1.706h.851V5.508a2.132 2.132 0 0 1-1.276-1.954ZM1.277 9.096c0-.47.38-.852.85-.852h1.986c.47 0 .852.381.852.852v2.558a.852.852 0 0 1-.852.853H2.128a.852.852 0 0 1-.851-.853V9.096Zm5.815-.852a.852.852 0 0 0-.85.852v2.558c0 .471.38.853.85.853h1.986c.47 0 .851-.382.851-.853V9.096a.852.852 0 0 0-.851-.852H7.092Zm4.114.852c0-.47.38-.852.85-.852h1.987c.47 0 .85.381.85.852v2.558a.852.852 0 0 1-.85.853h-1.986a.852.852 0 0 1-.851-.853V9.096Z"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      d="M5.106 18.05c0-.471.381-.853.851-.853h4.256c.47 0 .85.382.85.853v.852c0 .471-.38.853-.85.853H5.957a.852.852 0 0 1-.85-.852v-.853ZM6.255 4.406c0-.47.381-.852.851-.852h1.958c.47 0 .85.381.85.852v.427h3.277c.705 0 1.277.572 1.277 1.279H1.702c0-.707.572-1.28 1.277-1.28h3.276v-.426Z"
    />
  </svg>
);

export default SvgSlotsIcon;
