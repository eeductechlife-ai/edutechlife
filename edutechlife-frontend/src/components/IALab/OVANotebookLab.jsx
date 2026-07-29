import PropTypes from "prop-types";
import OVANotebookBase from './OVANotebookBase';
import { contentScreens, questionsData } from '../../data/ova/notebookLab';

export default function OVANotebookLab(props) {
  return (
    <OVANotebookBase
      {...props}
      data={{ contentScreens, questionsData }}
      translationPrefix="ova.notebooklab"
    />
  );
}

OVANotebookLab.propTypes = {
  onComplete: PropTypes.func,
};
