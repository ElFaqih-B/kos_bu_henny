"""add coordinates to cabang

Revision ID: ecbdc299d9c4
Revises: 20260722_01
Create Date: 2026-08-15
"""

from alembic import op
import sqlalchemy as sa


revision = "ecbdc299d9c4"
down_revision = "20260722_01"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "cabang",
        sa.Column(
            "latitude",
            sa.Float(),
            nullable=True,
        ),
    )

    op.add_column(
        "cabang",
        sa.Column(
            "longitude",
            sa.Float(),
            nullable=True,
        ),
    )


def downgrade() -> None:
    op.drop_column(
        "cabang",
        "longitude",
    )

    op.drop_column(
        "cabang",
        "latitude",
    )