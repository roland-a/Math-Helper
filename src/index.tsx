import './index.css'
import './expr/Expr'
import reportWebVitals from './reportWebVitals'
import { Screen } from './ui/Screen'
import * as ReactDOM from 'react-dom/client'

let root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

Screen.setToRoot(root)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
