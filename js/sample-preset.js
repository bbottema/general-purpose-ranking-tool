const SAMPLE_PRESET = JSON.stringify({
    "objects": [
        {
            "name": "Red Lamborghini",
            "Color": {
                "rank": 1
            },
            "Form-factor": {
                "rank": 2
            },
            "Driving experience": {
                "rank": 3
            },
            "Tilt / X-Factor": {
                "rank": 1
            }
        },
        {
            "name": "White BMW i5",
            "Color": {
                "rank": 2
            },
            "Form-factor": {
                "rank": 2
            },
            "Driving experience": {
                "rank": 2
            },
            "Tilt / X-Factor": {
                "rank": 2
            }
        },
        {
            "name": "Jaguar Silverstone",
            "Color": {
                "rank": 2
            },
            "Form-factor": {
                "rank": 1
            },
            "Driving experience": {
                "rank": 1
            },
            "Tilt / X-Factor": {
                "rank": 1
            }
        },
        {
            "name": "Red VW Beetle",
            "Color": {
                "rank": 1
            },
            "Form-factor": {
                "rank": 3
            },
            "Driving experience": {
                "rank": 4
            },
            "Tilt / X-Factor": {
                "rank": 3
            }
        }
    ],
    "categories": [
        {
            "name": "Color",
            "weight": 1
        },
        {
            "name": "Form-factor",
            "weight": 1.3
        },
        {
            "name": "Driving experience",
            "weight": 1.3
        },
        {
            "name": "Tilt / X-Factor",
            "weight": 0.5
        }
    ]
});