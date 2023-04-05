var stepNumber = 1;

export class Log {    
    StepDescription(input: string) {
        console.log(`Step #  ${ (stepNumber <= 9 ? `${stepNumber} ` : stepNumber) }: ${input}`);

        stepNumber++;
    }

    HeaderText(input: string = 'Test started!') {
        let logText = `======== ${input} ========`;
        
        console.log(logText);
    }

    FooterText(input: string = 'Test completed!') {
        let logText = `======== ${input} ========`;
        
        console.log(logText);
    }
}   