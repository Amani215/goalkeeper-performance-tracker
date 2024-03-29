"""Added: archived to users

Revision ID: e5582e593875
Revises: 480e174ab7e4
Create Date: 2023-07-21 14:32:48.547717

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e5582e593875'
down_revision = '480e174ab7e4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('archived', sa.BOOLEAN(), nullable=True))
    op.add_column('user', sa.Column('archive_reason', sa.String(length=128), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'archive_reason')
    op.drop_column('user', 'archived')
    # ### end Alembic commands ###
