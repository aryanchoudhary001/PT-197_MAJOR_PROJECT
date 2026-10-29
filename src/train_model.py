"""
Training Script Entry Point
Orchestrates data loading, validation, preprocessing, ANN & baseline training,
and saves versioned model artifacts and evaluation metrics.
"""

import sys
import os
import logging
from scripts.train_and_save import run_pipeline

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('cardio_monitor.train')

def main():
    logger.info("Executing full cardiovascular ANN model training pipeline...")
    try:
        run_pipeline()
        logger.info("Training pipeline completed successfully.")
    except Exception as e:
        logger.error(f"Training failed with error: {e}", exc_info=True)
        sys.exit(1)

if __name__ == '__main__':
    main()
