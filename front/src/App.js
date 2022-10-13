import { createGlobalStyle } from "styled-components";
import Router from "./Router";
import {ReactQueryDevtools} from 'react-query/devtools';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import "@fontsource/source-sans-pro";
import {QueryClientProvider,QueryClient}from 'react-query'
const queryClient = new QueryClient();
const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400&display=swap');
font-family: 'Source Sans Pro', sans-serif;
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: ${(props)=>props.theme.fontFamily};
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
body {
  font-weight: 300;
  background-color:${(props) => props.theme.bgColor};
  color:${(props) => props.theme.textColor};
  font-family:${(props)=>props.theme.fontFamily};
  line-height: 1.2;
  height:100vh;
}
*{
  box-sizing:border-box;
}
a{
  text-decoration:none;
  color:inherit;
}
menu, ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
`;
function App() {
  return (
      <RecoilRoot>
        <GlobalStyle />
        <Router />
      </RecoilRoot>

  );
}
export default App;
