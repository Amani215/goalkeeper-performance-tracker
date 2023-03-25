"""Removed bool params

Revision ID: b671d6ea17f9
Revises: badca9bb6e82
Create Date: 2023-03-25 14:23:49.433815

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b671d6ea17f9'
down_revision = 'badca9bb6e82'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('training_monitoring', sa.Column('attendance', sa.String(length=128), nullable=True))
    op.drop_column('training_monitoring', 'absent')
    op.drop_column('training_monitoring', 'with_seniors')
    op.drop_column('training_monitoring', 'comment')
    op.drop_column('training_monitoring', 'dismissed')
    op.drop_column('training_monitoring', 'with_national_team')
    op.drop_column('training_monitoring', 'hurt')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('training_monitoring', sa.Column('hurt', sa.BOOLEAN(), nullable=True))
    op.add_column('training_monitoring', sa.Column('with_national_team', sa.BOOLEAN(), nullable=True))
    op.add_column('training_monitoring', sa.Column('dismissed', sa.BOOLEAN(), nullable=True))
    op.add_column('training_monitoring', sa.Column('comment', sa.VARCHAR(length=128), nullable=True))
    op.add_column('training_monitoring', sa.Column('with_seniors', sa.BOOLEAN(), nullable=True))
    op.add_column('training_monitoring', sa.Column('absent', sa.BOOLEAN(), nullable=True))
    op.drop_column('training_monitoring', 'attendance')
    # ### end Alembic commands ###
