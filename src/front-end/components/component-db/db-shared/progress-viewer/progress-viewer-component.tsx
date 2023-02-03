import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'react-circular-progressbar/dist/styles.css';
export const ProgressViewer = (props: any) => {
  let uploadingData = props.uploadingData;
  return (
    <div>
      <div style={{ width: 100, height: 100 }}>
        <CircularProgressbar
          styles={buildStyles({
            rotation: 0, //1 / 2 + 1 / 8
            textSize: '16px',
            pathTransitionDuration: 0.35,
            strokeLinecap: 'butt',
            pathColor: `rgba(62, 152, 199`,
            textColor: '#3e98c7',
            trailColor: '#eee',
            backgroundColor: '#3e98c7'
          })}
          circleRatio={1} //0.75
          value={uploadingData ? uploadingData.progress : 0}
          maxValue={1}
          text={`${uploadingData ? (uploadingData.progress * 100).toFixed(0) : 0}%`}
        />
      </div>
      {uploadingData
        ? Object.keys(uploadingData).map((elm: any, i: number) => {
            console.log(elm, uploadingData[elm]);
            // validate if uploadingData[elm]) is not object
            if (typeof uploadingData[elm] !== 'object') {
              return (
                <div key={i}>
                  {elm} : {uploadingData[elm]}
                </div>
              );
            }
          })
        : null}
      <ProgressBar label={`${uploadingData ? Number((uploadingData.progress * 100).toFixed(0)) : 0}%`} now={uploadingData ? Number((uploadingData.progress * 100).toFixed(0)) : 0} />
    </div>
  );
};
