import sys
from typing import Dict, List

import eel

# noinspection PyUnresolvedReferences
from playhouse.shortcuts import model_to_dict

from doctec import schemas
from doctec.ctx import AppContext
from doctec.models import init_db
from doctec.utils.loggings import init_logging


# noinspection PyPep8Naming
@eel.expose
def fetchEmbeddingDetectionRuns(
    page_no: int = 0, page_size: int = -1
) -> List[schemas.EmbDetectionRunData]:
    """
    Fetch the embedding detection runs.

    :param page_no:
    :param page_size:
    :return: a list of embedding detection results in JSON format
    """
    runs = APP.emb_det_repo.fetch_runs(page_no, page_size)
    return [schemas.EmbDetectionRunData.from_pw_model(run) for run in runs]


# noinspection PyPep8Naming
@eel.expose
def fetchEmbeddingDetectionRunByUuId(run_uuid: str) -> schemas.EmbDetectionRunData:
    """
    Fetch the embedding detection run by id.

    :param run_uuid:
    :return: the embedding detection run in JSON format
    """
    run = APP.emb_det_repo.fetch_one_run_by_id(run_uuid)
    return schemas.EmbDetectionRunData.from_pw_model(run)


# noinspection PyPep8Naming
@eel.expose
def fetchEmbeddingDetectionResultByRunUuid(
    run_id: str,
) -> schemas.EmbDetectionResultDataWithoutRun:
    """
    Fetch the embedding detection result by run id.

    :param run_id:
    :return: the embedding detection result in JSON format
    """
    result = APP.emb_det_repo.fetch_one_result_by_run_id(run_id)
    return schemas.EmbDetectionResultDataWithoutRun.from_pw_model(result)


# noinspection PyPep8Naming
@eel.expose
def detectEmbeddedFiles(cfg: Dict[str, object]) -> str:
    """
    Launch the embedding detection task.

    :return: uuid of the detection run
    """
    from doctec.tasks.emb_detection import EmbDetectionJob

    cfg, _ = APP.emb_det_repo.fetch_or_create_config(**cfg)
    res = APP.emb_det_repo.init_run(cfg)
    job = EmbDetectionJob(cfg=cfg, res=res)
    APP.executor.submit(job.do, app=APP)
    return res.run.uuid.hex


if __name__ == "__main__":
    init_logging(level="INFO")
    init_db(db_path="app.db")

    with AppContext() as APP:
        # NOTE: uncomment the following line if you have only Microsoft Edge installed
        getattr(eel, "_start_args")["mode"] = "edge"

        if sys.argv[1] == "--develop":
            eel.init("client")
            # noinspection PyTypeChecker
            eel.start({"port": 3000}, host="localhost", port=8888)
        else:
            eel.init("build")
            eel.start("index.html")
