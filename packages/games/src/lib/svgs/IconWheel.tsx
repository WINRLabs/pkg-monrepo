import * as React from "react";
import type { SVGProps } from "react";

const SvgIconWheel = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#icon-wheel_svg__a)">
      <path d="M7.12 9.2c.283.117.604.013.82-.204.217-.216.321-.537.204-.82L6.26 3.626c-.184-.444-.707-.644-1.117-.39A9.117 9.117 0 0 0 2.18 6.198c-.252.41-.053.933.391 1.117L7.12 9.2ZM17.632 13.555c.444.184.954-.044 1.066-.511a9.063 9.063 0 0 0 0-4.199c-.112-.467-.622-.695-1.066-.511l-4.55 1.884c-.283.117-.437.419-.437.726s.154.608.437.726l4.55 1.885ZM11.633 8.176c-.117.283-.013.604.204.82.216.217.537.321.82.204l4.55-1.884c.444-.184.644-.708.39-1.117a9.116 9.116 0 0 0-2.963-2.964c-.41-.253-.933-.053-1.117.391l-1.884 4.55ZM8.144 13.713c.117-.283.013-.604-.204-.82-.216-.217-.537-.321-.82-.204l-4.55 1.884c-.444.184-.643.708-.39 1.117a9.117 9.117 0 0 0 2.963 2.964c.41.253.933.053 1.117-.391l1.884-4.55ZM6.696 11.67c.284-.117.437-.418.437-.725s-.153-.609-.437-.726l-4.55-1.885c-.444-.183-.954.045-1.065.512a9.063 9.063 0 0 0 0 4.199c.11.467.621.695 1.065.511l4.55-1.885ZM12.658 12.689c-.284-.117-.605-.013-.821.204-.217.216-.321.537-.204.82l1.884 4.55c.184.444.708.643 1.117.39a9.116 9.116 0 0 0 2.964-2.963c.253-.41.053-.933-.391-1.117l-4.55-1.884ZM10.615 14.138c-.118-.284-.42-.437-.726-.437-.307 0-.609.153-.726.437l-1.884 4.55c-.184.444.044.954.511 1.066a9.063 9.063 0 0 0 4.199 0c.467-.112.695-.622.511-1.066l-1.885-4.55ZM9.89 9.291a1.654 1.654 0 1 0 0 3.307 1.654 1.654 0 0 0 0-3.307Zm0 2.205a.55.55 0 1 1-.001-1.102.55.55 0 0 1 0 1.102ZM8.357.763 9.38 3.22a.55.55 0 0 0 1.018 0L11.42.763A.55.55 0 0 0 10.913 0H8.865a.55.55 0 0 0-.508.763Z" />
      <path d="M12.4 2.245a.422.422 0 0 0-.505.247l-.48 1.152a1.654 1.654 0 0 1-3.053 0l-.48-1.152a.422.422 0 0 0-.504-.248.418.418 0 0 0-.262.567l2.046 4.941c.118.284.42.437.726.437.307 0 .608-.153.726-.437L12.66 2.81a.417.417 0 0 0-.262-.565Z" />
    </g>
    <defs>
      <clipPath id="icon-wheel_svg__a">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgIconWheel;