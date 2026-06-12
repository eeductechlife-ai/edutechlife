import OVANotebookBase from './OVANotebookBase';
import { contentScreens, questionsData } from '../../data/ova/notebookSim';

export default function OVANotebookSimulator(props) {
  return (
    <OVANotebookBase
      {...props}
      data={{ contentScreens, questionsData }}
      translationPrefix="ova.notebooksim"
      imageLayoutClass="lg:min-h-[300px]"
      contentPanelMaxHeight="max-h-[550px]"
    />
  );
}
