import Board from './components/Board/Board';
import { SnackbarProvider } from 'notistack';

/* 
  __                           
 /  )_   '_ /  /|/| '_ / _ _ / 
/(_/(//)/(-(  /   |/( /)(/(-(  
*/

function App() {
  return (
    <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <main className="App">
        <Board lanes={['Todo', 'Doing', 'Done']} title="Todo Board" />
        {/* you can add more boards! */}
        {/* <Board lanes={['Backlog', 'In Progress', 'Completed']} title="Scrum Board" /> */}
      </main>
    </SnackbarProvider>
  );
}

export default App;
